var db = require('./db');

var addBookLoan = function(bookLoan, cb){
    db.executeQueryStmt('insert into tbl_book_loans(bookId, branchId, cardNo, dateOut, dueDate, dateIn) values(?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NULL)',
        [bookLoan.book.bookId, bookLoan.branch.branchId, bookLoan.borrower.cardNo], cb);
}

var removeBooKLoan = function(bookLoan, cb){
    db.executeQueryStmt('update tbl_book_loans set dateIn = NOW() where bookId = ? and branchId = ? and cardNo = ? and dateOut = ? and dateIn IS NULL',
        [bookLoan.book.bookId, bookLoan.branch.branchId, bookLoan.borrower.cardNo, bookLoan.dateOut, bookLoan.dateOut], cb);
}

var getLoan

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
    let sqlString = "select tblbl.dateOut, tblbl.dateIn, tblbl.dueDate, tb.bookId, tb.title, tblb.name, tblb.cardNo, tbllb.branchId"
        + ", tbllb.branchName from tbl_book_loans tblbl, tbl_book tb, tbl_borrower tblb, tbl_library_branch tbllb"
        + " where tblbl.branchId = tbllb.branchId and tblbl.cardNo = tblb.cardNo and tblbl.bookId = tb.bookId";
    db.getAllObjects(sqlString, cb);
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