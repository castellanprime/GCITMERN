var express = require("express");
var bodyParser = require("body-parser");
var adminRoutes = require('./controllers/adminController');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use("/admin", adminRoutes);

app.listen(3000);
console.log('Server running in port: 3000 ...');
