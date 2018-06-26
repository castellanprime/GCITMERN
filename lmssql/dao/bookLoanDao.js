var db = require('./db');

var addBookLoan = function(bookLoan, cb){
    db.executeQueryStmt('insert into tbl_book_loans(bookId, branchId, cardNo, dateOut, dueDate, dateIn) values(?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NULL)',
        [bookLoan.book.bookId, bookLoan.branch.branchId, bookLoan.borrower.cardNo], cb);
}

var removeBooKLoan = function(bookLoan, cb){
    db.executeQueryStmt('update tbl_book_loans set dateIn = NOW() where bookId = ? and branchId = ? and cardNo = ? and dateOut = ? and dateIn IS NULL',
        [bookLoan.book.bookId, bookLoan.branch.branchId, bookLoan.borrower.cardNo, bookLoan.dateOut, bookLoan.dateOut], cb);
}

var getCurrentLoans = function(bookLoan, cb){
    db.executeQueryStmt('select * from tbl_book_loans where branchId = ? and bookId = ? and cardNo = ? and dateIn is NULL',
        [bookLoan.branch.branchId, bookLoan.book.bookId, bookLoan.borrower.cardNo], cb);
}

var getCurrentLoansForBranch = function(branchId, cb){
    db.executeQueryStmt('select * from tbl_book_loans where branchId = ? and dateIn is NULL', [branchId], cb);
}

var getAllBookLoansForBranch = function(branchId, cb){
    db.executeQueryStmt('elect * from tbl_book_loans where branchId = ?', [branchId], cb);
}

var getAllBookLoansForBorrower = function(carNo, cb){
    db.executeQueryStmt('select * from tbl_book_loans where cardNo = ?', [carNo], cb);
}

var getCurrentLoansForBorrower = function(cardNo, cb){
    db.executeQueryStmt('select * from tbl_book_loans where cardNo = ? and dateIn is NULL', [cardNo], cb);
}

var changeDueDate = function(bookLoan, cb){
    db.executeQueryStmt('update tbl_book_loans set dueDate = ? where bookId = ? and branchId = ? and cardNo = ? and dateOut = ?',
        [bookLoan.dueDate, bookLoan.book.bookId, bookLoan.branch.branchId, bookLoan.borrower.cardNo, bookLoan.dateOut], cb);
}

var getAllBookLoans = function(cb){
    db.getAllObjects('select * from tbl_book_loans', cb);
}

module.exports = {
    addBookLoan,
    changeDueDate,
    removeBooKLoan,
    getAllBookLoans,
    getAllBookLoansForBranch,
    getAllBookLoansForBorrower,
    getCurrentLoans,
    getCurrentLoansForBranch,
    getCurrentLoansForBorrower
};