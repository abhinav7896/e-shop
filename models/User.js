const db = require("../utils/db");

module.exports = class User {

  static fetchOne(username, password) {
    console.info(`Connecting to Database: ${process.env.ESHOP_DB_HOST}`);
    return db.execute("SELECT uname FROM reg_users WHERE uname=?", [username]);
  }
  static register(username, password, ename) {
    console.log(`Connecting to Database: ${process.env.ESHOP_DB_HOST}`);
    return db.query("INSERT INTO reg_users ( uname, password ) VALUES (?, ?); INSERT INTO linkedWallet ( uname, ewalletid ) VALUES (?, ?)", [username, password, username, ename]);
  }
  static verifyUser(username) {
    console.log(`Connecting to Database: ${process.env.ESHOP_DB_HOST}`);
    return db.query(
      "SELECT uname, password FROM reg_users WHERE uname=?; SELECT ewalletid FROM linkedWallet WHERE uname=?",
      [username, username]
    );
  }
};
