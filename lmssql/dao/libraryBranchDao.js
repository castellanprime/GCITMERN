var db = require('./db');

var addLibraryBranch = function(libraryBranch, cb){
    db.executeQueryStmt('insert into tbl_library_branch(branchName, branchAddress) values(?, ?)',
        [libraryBranch.branchName, libraryBranch.branchAddress], cb)
}

var updateBranchName = function(libraryBranch, cb){
    db.executeQueryStmt('update tbl_library_branch set branchName = ? where branchId = ?',
        [libraryBranch.branchName, libraryBranch.branchId], cb);
} 

var updateBranchAddress = function(libraryBranch, cb){
    db.executeQueryStmt('update tbl_library_branch set branchAddress = ? where branchId = ?',
        [libraryBranch.branchAddress, libraryBranch.branchId], cb);
}

var deleteBranch = function(branchId, cb){
    db.executeQueryStmt('delete from tbl_library_branch where branchId = ?', [branchId], cb);
}

var getAllBranches = function(cb){
    db.getAllObjects('select * from tbl_library_branch', cb);
}

var getBranch = function(branchId, cb){
    db.executeQueryStmt('select * from tbl_library_branch tlb where tlb.branchId = ?', [branchId], cb);
}

var getAllBranchesWithBooks = function(cb){
    db.getAllObjects('select tlb.branchId as branchId, branchName, branchAddress, tb.bookId, title, pubId from tbl_library_branch tlb, tbl_book_copies tbc, tbl_book tb where tbc.branchId = tlb.branchId and tb.bookId = tbc.bookId and tbc.bookId IN (select bookId from tbl_book)',cb);
}

var getAllBooksForABranch= function(branchId, cb){
    db.executeQueryStmt('select tb.bookId as bookId, title from tbl_book_copies tbc, tbl_book tb where tbc.bookId = tb.bookId and tbc.branchId = 3',
        [branchId], cb);
}

module.exports = {
    addLibraryBranch,
    deleteBranch,
    getAllBranches,
    getAllBooksForABranch,
    getAllBranchesWithBooks,
    getBranch,
    updateBranchName,
    updateBranchAddress
};