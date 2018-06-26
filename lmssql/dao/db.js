var mysql = require('mysql');

var conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "cooler",
  database: "library"
});

var executeQueryStmt = function(queryString, queryParams, cb){
    conn.beginTransaction(function(err){
        if (err) cb(err, null);

        conn.query(queryString, queryParams, function(err, result){
            if(err){
                conn.rollback(function(err, result1){
                    cb(err, result);
                })
            }
            conn.commit(function(err, result1){
                cb(err, result);
            })
        })
    });
}

var getOneObject = function(queryString, queryParams, cb){
    conn.query(queryString, queryParams, function(err, result){
        cb(err, result);
    })
}


var getAllObjects = function(queryString, cb){
    conn.query(queryString, function(err, result){
        cb(err, result);
    })
}

module.exports = {
    executeQueryStmt,
    getOneObject,
    getAllObjects   
};