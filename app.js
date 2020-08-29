const express = require('express');
const path = require('path');
const productsController = require('./controllers/Products');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded());
app.use(express.json());

app.use("/products", productsController);

app.get("/home", (req, res) => {
    return res.status(200).render("home");
});

app.use("/*", (req, res) => {
    console.info(`404: ${req.originalUrl}`);
    return res.status(404).render('errors/404', {
        url: req.originalUrl
    });
});

app.listen(8080, () => console.log('Server listening on port: ', 8080));

module.exports = app;