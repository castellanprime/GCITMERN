var express = require("express");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(require('./controllers/adminController'));
app.use(require('./controllers/borrowerController'));
app.use(require('./controllers/librarianController'));

app.listen(3000);
console.log('Server running in port: 3000 ...');
