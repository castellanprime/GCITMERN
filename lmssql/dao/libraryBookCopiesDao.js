var db = require('./db');

var saveBranchBook = function(branchBookCopies, cb){
    db.executeQueryStmt('insert into tbl_book_copies (bookId, branchId, noofCopies) values (?, ?, ?)', 
        [branchBookCopies.bookId, branchBookCopies.branchId, branchBookCopies.noOfCopies], cb);
}

var updateBookCopies = function(branchBookCopies, cb){
    db.executeQueryStmt('update tbl_book_copies tbc set tbc.noOfCopies = ? where tbc.branchId = ? and tbc.bookId = ?', 
        [branchBookCopies.noOfCopies, branchBookCopies.branchId, branchBookCopies.bookId], cb);
}

var getAllBooksForABranch = function(branchId, cb){
    db.executeQueryStmt('select * from tbl_book_copies tbc where tbc.branchId = ?', [branchId], cb);
}

var getAllCopiesOfBookInBranch = function(branchId, bookId, cb){
    db.executeQueryStmt('select * from tbl_book_copies tbc where tbc.branchId = ? and tbc.bookId = ?', 
        [branchId, bookId], cb);
}

module.exports = {
    saveBranchBook,
    updateBookCopies,
    getAllBooksForABranch,
    getAllCopiesOfBookInBranch
};