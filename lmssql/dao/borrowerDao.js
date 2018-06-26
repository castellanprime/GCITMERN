var db = require('./db');

var addBorrower = function(borrower, cb){
    db.executeQueryStmt('insert into tbl_borrower(name, address, phone) values(?, ?, ?)', 
        [borrower.name, borrower.address, borrower.phone], cb);
}

var updateBorrowerName = function(borrowerName, cardNo, cb){
    db.executeQueryStmt('update tbl_borrower set name = ? where cardNo = ?', [borrowerName, cardNo], cb);
}

var updateBorrowerAddress = function(borrowerAddress, cardNo, cb){
    db.executeQueryStmt('update tbl_borrower set address = ? where cardNo = ?', [borrowerAddress, cardNo], cb);
}

var updateBorrowerPhone = function(borrowerPhone, cardNo, cb){
    db.executeQueryStmt('update tbl_borrower set phone = ? where cardNo = ?', [borrowerPhone, cardNo], cb);
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
    updateBorrowerName,
    updateBorrowerAddress,
    updateBorrowerPhone
};