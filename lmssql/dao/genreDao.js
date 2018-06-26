var db = require('./db');

var addGenre = function(genre, cb){
    db.executeQueryStmt('insert into tbl_genre(genre_name) values(?)', [genre.genre_name], cb);
}

var updateGenreName = function(genre, cb){
    db.executeQueryStmt('update tbl_genre set genre_name = ? where genre_id = ?', [genre.genre_name, genre.genre_id], cb);
}

var deleteGenre = function(genreId, cb){
    db.executeQueryStmt('delete from tbl_genre where genre_id = ?', [genreId], cb);
}

var removeGenreFromBook = function(genreId, bookId, cb){
    db.executeQueryStmt('delete from tbl_book_genres where genre_Id = ? and bookId = ?', [genreId, bookId], cb);
}

var getGenre = function(genreId, cb){
    db.getOneObject('select * from tbl_genre where genre_id = ?', [genreId], cb);
}

var getAllGenres = function(cb){
    db.getAllObjects('select * from tbl_genre', cb);
}

var getAllGenresForABook = function(bookId, cb){
    db.executeQueryStmt('select * from tbl_genre tg, tbl_book_genres tbg where tg.genre_id = tbg.genre_Id and tbg.bookId = ?', 
        [bookId], cb);
}

var getAllBooksForAGenre = function(genreId, cb){
    db.executeQueryStmt('select tb.bookId as bookId, title from tbl_book_genres tbg, tbl_book tb where tbg.bookId = tb.bookId and tbg.genre_Id = ?',
        [genreId], cb);
}

module.exports = {
    addGenre,
    updateGenreName,
    deleteGenre,
    removeGenreFromBook,
    getGenre, 
    getAllGenres,
    getAllBooksForAGenre,
    getAllGenresForABook
};