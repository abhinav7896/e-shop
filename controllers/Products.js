const express = require("express");
const router = express.Router();
const user = require("../models/User");
const warehouse = require("../models/Warehouse");
const ewallet = require("../models/ewallet");
const passwordHash = require('password-hash');

router.post("/register", (req, res) => {
  const uname = req.body.username
  const pass = req.body.password
  const ename = req.body.ename
  const ewpassword = req.body.ewpassword
  const hashedEshopPass = passwordHash.generate(pass);
  console.log(hashedEshopPass)
  if (uname.trim() === '' || pass.trim() === '') {
    return res.status(400).render("jobs/RegisterFailed");
  } else {
    user.fetchOne(uname.toLowerCase()).then((response) => {
      console.log("Checking for duplicate users...");
      if (response == undefined || response[0].length == 0) {
        console.log("No duplicate username...");
        console.log("Authenticating e-wallet...");
        return ewallet.authenticate(ename, ewpassword)
      }
      else {
        throw new Error("User already exists!")
      }
    }).then((response) => {
      if (response == undefined) {
        throw new Error("Could not register user! Something went wrong!")
      }
      if (response.status == 200) {
        console.log("E-Wallet credentials authenticated");
        return user.register(uname.toLowerCase(), hashedEshopPass, ename)
      }
      else {
        throw new Error("Could not register user! Something went wrong!")
      }
    }).then((response) => {
      if (response == undefined) {
        throw new Error("Could not register user! Something went wrong!")
      }
      else {
        return res.status(200).render("jobs/RegisterSuccess");
      }
    }).catch(error => {
      if (error.response != undefined && error.response.status == 401) {
        console.log(error.response.status);
        console.log("Invalid EWallet Credentials..");
        return res.status(500).render("errors/500", { message: `${error.response.status}: Invalid E-Wallet credentials` });
      }
      return res.status(500).render("errors/500", { message: error });
    }
    )
  }
})

router.get("/display", (req, res) => {
  warehouse.fetchAllProducts().then((response) => {
    console.log(response.data.data)
    const data = response.data.data
    if (data.length > 0) {
      return res.status(200).render("jobs/DisplayAllProducts", { products: data });
    } else {
      return res.status(500).render("errors/500", { message: "No products to display!" });
    }
  }).catch((error) => {
    return res.status(500).render("errors/500", { message: error });
  })
});

router.get("/placeorder", (req, res) => {
  const pName = req.query.productName;
  const price = req.query.productPrice;
  console.log(pName, price)
  return res.status(200).render("jobs/PlaceOrder", { pName: pName, price: price });
});

router.post("/order", (req, res) => {
  // const ename = req.body.ename;
  const pName = req.body.productName;
  const qty = req.body.qty;
  const price = req.body.price;
  const uname = req.body.username;
  const pass = req.body.password;
  const transactionId = '4567';
  var stockFlag = true;
  console.log(pName, qty, uname, pass, price)
  user.verifyUser(uname.toLowerCase())
    .then((responses) => {
      //authenticate the user
      console.log(responses[0][0])
      console.log(responses[0][1])
      if (responses[0][0].length < 1 || responses[0][1].length < 1) {
        throw new Error("No such user exists. Please register!");
      } else {
        console.log("Authenticating the user...");
        const hashedPass = responses[0][0][0].password;
        const is_verified = passwordHash.verify(pass, hashedPass)
        console.log(hashedPass, is_verified)
        if (!is_verified) {
          throw new Error("Incorrect credentials!");
        } else {
          ename = responses[0][1][0].ewalletid
          console.log("User verified!");
          const amount = parseFloat(price) * parseInt(qty)
          return ewallet.order(ename, transactionId, amount)
        }
      }
    }).then((response) => {
      if (response.data.balanceUpdate == 0) {
        console.log("Balance updated. Placing order with warehouse...")
        return warehouse.order(pName, transactionId, qty)
      } else {
        throw new Error('Balance insufficient... Order failed!')
      }
    }).then(response => {
      if (response == undefined) {
        throw new Error("Order failed!")
      }
      else if (response.data.orderStatus == true) {
        console.log("Balance sufficient. Quantity sufficient.")
        return ewallet.prepare(transactionId)
      } else {
        ewallet.prepare(transactionId).then((response) => {
          if (response.data.prepared == true) {
            console.log('EWallet prepare success!')
            ewallet.rollback(transactionId).then((response) => {
              if (response.data.rolledBack == true) {
                console.log('Quantity out of stock. EWallet rolled back!')
                throw new Error('Quantity out of stock! Order failed');
              }
              else {
                console.log('EWallet roll back failed!')
                throw new Error('Quantity out of stock! Order failed');
              }
            }).catch((error) => {
              stockFlag = false;
            })
          }
          else {
            console.log('EWallet prepare failed!')
            throw new Error('Quantity out of stock! Order failed')
          }
        }).catch((error) => {
          throw new Error(error.message)
        })
      }
    }).then(response => {
      if (response == undefined) {
        throw new Error("Order failed! Product out of stock!")
      }
      else if (response.data.prepared == true) {
        console.log("EWallet prepared, preparing warehouse...")
        return warehouse.prepare(transactionId)
      } else {
        console.log("EWallet prepare status failed")
        warehouse.prepare(transactionId).then((response) => {
          if (response.data.prepared == true) {
            console.log('Warehouse prepare success!')
            warehouse.rollback(transactionId).then((response) => {
              if (response.data.rolledBack == true) {
                console.log('EWallet prepare failed. Warehouse rolled back!')
                throw new Error('Order failed');
              }
              else {
                console.log('Warehouse roll back failed!')
                throw new Error('Order failed');
              }
            }).catch((error) => {
              throw error
            })
          }
          else {
            console.log('Warehouse prepare failed!')
            throw new Error('Order failed')
          }
        }).catch((error) => {
          throw error
        })
      }
    }).then(response => {
      if (response == undefined) {
        throw new Error("Order failed!")
      }
      else if (response.data.prepared == true) {
        console.log("Both prepared, committing EWallet...")
        return ewallet.commit(transactionId)
      } else {
        console.log("EWallet prepared, Warehouse prepare failed. Rolling back EWallet")
        ewallet.rollback(transactionId).then((response) => {
          if (response.data.rolledBack == true) {
            console.log("Warehouse not prepared. EWallet rolled back")
          }
          else {
            console.log("Warehouse not prepared. EWallet roll back also failed")
          }
          throw new Error('Order failed!')
        }).catch((error) => {
          throw new Error("Order failed!")
        })
      }
    }).then(response => {

      if (response == undefined) {
        throw new Error("Order failed!")
      }
      else if (response.data.committed == true) {
        console.log("EWallet committed, committing warehouse...")
        return warehouse.commit(transactionId)
      }
      else {
        console.log("EWallet commit failed. Rolling back warehouse!")
        warehouse.rollback(transactionId).then((response) => {
          console.log("Warehouse rollback status:", response.data.rolledBack)
          if (response.data.rolledBack == true) {
            console.log("EWallet commit failed. Warehouse rolledBack")
          }
          else {
            console.log("EWallet commit failed. Warehouse rollback failed!")
          }
          throw new Error("Order failed!")
        }).catch((error) => {
          throw error
        })
      }
    }).then((response) => {
      if (response == undefined) {
        throw new Error("Order failed!")
      }
      else if (response.data.committed == true) {
        console.log("EWallet committed, Warehouse committed..Order successful...")
        return res.status(200).render('jobs/OrderSuccess')
      }
      else {
        console.log("EWallet committed, Warehouse commit failed..Order failed...")
        throw new Error('Order failed')
      }
    })
    .catch((error) => {
      if (stockFlag == false) {
        return res.status(500).render("errors/500", { message: "Order failed! Product out of stock!" });
      }
      return res.status(500).render("errors/500", { message: error.message });
    })
});
module.exports = router;