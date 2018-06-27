var db = require('./db');

var addBorrower = function(borrower, cb){
    db.executeQueryStmt('insert into tbl_borrower(name, address, phone) values(?, ?, ?)', 
        [borrower.name, borrower.address, borrower.phone], cb);
}

var getBorrower = function(cardNo, cb){
    db.executeQueryStmt('select * from tbl_borrower where cardNo = ?', [cardNo], cb);
}

var updateBorrowerName = function(borrower, cb){
    db.executeQueryStmt('update tbl_borrower tb set tb.name = ? where tb.cardNo = ?', [borrower.name, borrower.cardNo], cb);
}

var updateBorrowerAddress = function(borrower, cb){
    db.executeQueryStmt('update tbl_borrower tb set tb.address = ? where tb.cardNo = ?', [borrower.address, borrower.cardNo], cb);
}

var updateBorrowerPhone = function(borrower, cb){
    db.executeQueryStmt('update tbl_borrower tb set tb.phone = ? where tb.cardNo = ?', [borrower.phone, borrower.cardNo], cb);
}

var deleteBorrower = function(cardNo, cb){
    db.executeQueryStmt('delete from tbl_borrower where cardNo = ?', [cardNo], cb);
}

var getAllBorrowers = function(cb){
    db.getAllObjects('select * from tbl_borrower', cb);
}

module.exports = {
    addBorrower,
    deleteBorrower,
    getAllBorrowers,
    getBorrower,
    updateBorrowerName,
    updateBorrowerAddress,
    updateBorrowerPhone
};