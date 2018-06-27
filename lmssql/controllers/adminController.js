var routes = require("express").Router();
let authorDao = require('../dao/authorDao');
let bookDao = require('../dao/bookDao');
let libraryBranchDao = require('../dao/libraryBranchDao');
let publisherDao = require('../dao/publisherDao');
let genreDao = require('../dao/genreDao');
let bookLoanDao = require('../dao/bookLoanDao');
let libraryBookCopiesDao = require('../dao/libraryBookCopiesDao');


var getBookLoanByDateOut = function(bookLoans, bookId, cardNo, dateOut){
    for (let i in bookLoans){
        let data = bookLoans[i];
        if (data.bookId === bookId && data.cardNo === cardNo && data.dateOut.getTime() === dateOut.getTime()){
            return data;
        }
    }
    return null;
}

routes.post('/api/admin/authors', function(req, res){
    let author = req.body;  
    authorDao.addAuthor(author, function(err, result){
        if (err){
            res.status(400);
            res.send('Add Author Failed');
        } 
        authorDao.getAuthor(result.insertId, function(err1, result1){
            if (err1){
                res.status(500);
                res.send("Error retrieving new created author with id: ", result.insertId);
            }
            res.status(201);
            console.log("1 record inserted");
            let objUrl = "/api/admin/authors/" + result.insertId;
            res.location(objUrl);
            res.send(result1);
        });  
    });
});

routes.patch('/api/admin/authors/:authorId(\\d+)', function(req, res){
    let authorName = req.body.authorName;
    authorDao.updateAuthor(authorName, req.params.authorId, function(err, result){
        if (err){
            res.status(400);
            res.send("Edit Author Failed");
        }
        authorDao.getAuthor(req.params.authorId, function(err1, result1){
            if (err1){
                res.status(500);
                res.send("Error retrieving new created author with id: ", req.params.authorId);
            }
            res.status(200);
            console.log("1 record edited");
            res.send(result1);
        });
    });
});

routes.get('/api/admin/authors/:authorId(\\d+)', function(req, res){
    authorDao.getAuthor(req.params.authorId, function(err, result){
        if (err){
            res.status(404);
            res.send("Author Not Found");
        }
        res.status(200);
        console.log("1 record retrieved");
        res.send(result);
    });
});

routes.delete('/api/admin/authors/:authorId(\\d+)', function(req, res){
    authorDao.deleteAuthor(req.params.authorId, function(err, result){
        if (err){
            res.status(404);
            res.send("Author Not Found");
        }
        res.status(204).send();
        console.log("1 record deleted");
    });
});

routes.delete('/api/authors/:authorId(\\d+)/books/:bookId(\\d+)', function(req, res){
    authorDao.removeAuthorFromABook(req.params.authorId, req.params.bookId, function(err, result){
        if (err){
            res.status(400);
            res.send("Bad Request");
        }
        res.status(204).send();
        console.log("1 record altered");
    });
});

routes.get('/api/admin/authors', function(req, res){
    authorDao.getAllAuthors(function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result);
    })
});

routes.get('/api/admin/authors/:authorId(\\d+)/books', function(req, res){
    authorDao.getAllBooksForAnAuthor(req.params.authorId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result);
    });
});

routes.post('/api/admin/branches', function(req, res){
    let libraryBranch = req.body;
    libraryBranchDao.addLibraryBranch(libraryBranch, function(err, result){
        if (err){
            res.status(400);
            res.send("Add Branch Failed");
        }
        libraryBranchDao.getBranch(result.insertId, function(err1, result1){
            if (err1){
                res.status(500);
                res.send("Error retrieving branch for id: ", result.insertId);
            }
            res.status(201);
            console.log("1 record inserted");
            let objUrl = "/api/admin/branches/" + result.insertId;
            res.location(objUrl);
            res.send(result1);
        }); 
    });
});

routes.patch('/api/admin/branches/:branchId(\\d+)', function(req, res){
    if (Reflect.has(req.body, 'branchName') === true){
        let libraryBranch = Object.assign({}, req.body, {branchId: req.params.branchId});
        libraryBranchDao.updateBranchName(libraryBranch, function(err, result){
            if (err){
                res.status(400);
                res.send("Update Branch Name Failed");
            } 
        });
    } 
    if (Reflect.has(req.body, 'branchAddress') === true){
        let libraryBranch1 = Object.assign({}, req.body, {branchId: req.params.branchId});
        libraryBranchDao.updateBranchAddress(libraryBranch1, function(err, result){
            if (err){
                res.status(404);
                res.send("Not Found");
            }
        });
    }
    libraryBranchDao.getBranch(req.params.branchId, function(err1, result1){
        if (err1){
            res.status(400);
            res.send("Error retrieving branch for id: ", result.insertId);
        }
        res.status(200);
        console.log("1 record updated");
        res.send(result1);
    }); 
});

routes.delete('/api/admin/branches/:branchId(\\d+)', function(req, res){
    libraryBranchDao.deleteBranch(req.params.branchId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(204).send();
        console.log("1 record deleted");
    });
});

routes.get('/api/admin/branches', function(req, res){
    libraryBranchDao.getAllBranches(function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result);
    })
});

routes.get('/api/admin/branches/:branchId(\\d+)/books', function(req, res){
    libraryBranchDao.getAllBooksForABranch(req.params.branchId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result);
    });
});

routes.post('/api/admin/publishers', function(req, res){
    let publisher = req.body;
    publisherDao.addPublisher(publisher, function(err, result){
        if (err){
            res.status(404);
            res.send("Add Publisher Failed");
        }
        publisherDao.getPublisher(result.insertId, function(err1, result1){
            if (err1){
                res.status(500);
                res.send("Error retrieving new created publisher");
            }
            res.status(201);
            console.log("1 record inserted");
            let objUrl = "/api/admin/publishers/" + result.insertId;
            res.location(objUrl);
            res.send(result1);
        });
    });
});

routes.patch('/api/admin/publishers/:publisherId(\\d+)', function(req, res){
    if (Reflect.has(req.body, 'publisherName') === true){
        let publisher = Object.assign({}, req.body, {publisherId: req.params.publisherId});
        publisherDao.updatePublisherName(publisher, function(err, result){
            if (err){
                res.status(500);
                res.send("Update Publisher Name Failed");
            }
        });
    }
    if (Reflect.has(req.body, 'publisherAddress') === true){
        let publisher1 = Object.assign({}, req.body, {publisherId: req.params.publisherId});
        publisherDao.updatePublisherAddress(publisher1, function(err, result){
            if (err){
                res.status(500);
                res.send("Update Publisher Address Failed");
            }
        });
    }
    if (Reflect.has(req.body, 'publisherPhone') === true){
        let publisher2 = Object.assign({}, req.body, {publisherId: req.params.publisherId});
        publisherDao.updatePublisherPhone(publisher2, function(err, result){
            if (err){
                res.status(500);
                res.send("Update Publisher Phone Failed");
            }
            console.log(result);
        });
    }
    publisherDao.getPublisher(req.params.publisherId, function(err, result){
        if (err){
            res.status(400);
            res.send("Error retrieving branch for id: ", req.params.publisherId);
        }
        res.status(200);
        console.log("1 record updated");
        res.send(result);
    });
});

routes.delete('/api/admin/publishers/:publisherId(\\d+)', function(req, res){
    publisherDao.deletePublisher(req.params.publisherId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(204).send();
        console.log("1 record deleted");
    });
});

routes.get('/api/admin/publishers', function(req, res){
    publisherDao.getAllPublishers(function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result);
    })
});

routes.get('/api/admin/publishers/:publisherId(\\d+)', function(req, res){
    publisherDao.getPublisher(req.params.publisherId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        res.send(result);
    })
});

routes.post('/api/admin/books', function(req, res){
    let bookDto = req.body;
    bookDao.addBook(bookDto, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        bookDao.getBook(result.insertId, function(err1, result1){
            if (err1){
                res.status(500);
                res.send("Error retrieving newly created book");
            }
            res.status(201);
            console.log("1 record inserted");
            let objUrl = "/api/admin/books/" + result.insertId;
            res.location(objUrl);
            res.send(result1);
        });
    });
});

routes.delete('/api/admin/books/:bookId(\\d+)', function(req, res){
    bookDao.deleteBook(req.params.bookId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(204).send();
        console.log("1 record deleted");
    });
});

routes.get('/api/admin/books', function(req, res){
    bookDao.getAllBooks(function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result);
    });
});

routes.get('/api/admin/books/:bookId(\\d+)/metadata', function(req, res){
    bookDao.getAuthorsGenresForABook(req.params.bookId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        let st = result.length + " Records Returned";
        console.log(st);
        let resToSend = {};
        resToSend['authors'] = [];
        resToSend['genres'] = [];
        for (let index in result){
            let data = result[index];
            resToSend['authors'].push({authorId: data.authorId, authorName: data.authorName});
            resToSend['genres'].push({genre_id: data.genre_id, genre_name: data.genre_name});
        }
        console.log(resToSend);
        res.status(200);
        res.send(resToSend);
    });
});

routes.patch('/api/admin/books/:bookId(\\d+)', function(req, res){
    let bookDto = req.body;
    if (Reflect.has(bookDto, 'title') === true){
        bookDao.updateBookTitle(bookDto.title, req.params.bookId, function(err1, result1){
            if (err1){
                res.status(500);
                res.send("Error updating title for book: ", req.params.bookId);
            }
        });
    }
    if (Reflect.has(bookDto, 'pubId') === true){
        bookDao.updateBookPublisher(bookDto.pubId, req.params.bookId, function(err2, result2){
            if (err2){
                res.status(500);
                res.send("Error updating publisher for book: ", req.params.bookId);
            }
        });
    }
    if (Reflect.has(bookDto, 'authorId') === true){
        bookDao.addBookAuthors(req.params.bookId, bookDto.authorId, function(err3, result3){
            if (err3){
                res.status(500);
                res.send("Error updating author for book: ", req.params.bookId);
            }
        });
    }
    if (Reflect.has(bookDto, 'genreId') === true){
        bookDao.addBookGenres(req.params.bookId, bookDto.genreId, function(err3, result3){
            if (err3){
                res.status(500);
                res.send("Error updating genre for book: ", req.params.bookId);
            }
        });
    }
    bookDao.getBook(req.params.bookId, function(err4, result4){
        if (err4){
            res.status(404);
            res.send("Not Found Book");
        }
        res.status(200);
        res.send(result4);
    });
});

routes.post('/api/admin/genres', function(req, res){
    let genre = req.body;
    genreDao.addGenre(genre, function(err, result){
        if (err){
            res.status(400);
            res.send("Bad Request");
        }
        genreDao.getGenre(result.insertId, function(err1, result1){
            if (err1){
                res.status(500);
                res.send("Error retrieving newly created genre");
            }
            res.status(201);
            console.log("1 record inserted");
            let objUrl = "/api/admin/genres/" + result.insertId;
            res.location(objUrl);
            res.send(result1);
        });
    });
});

routes.patch('/api/admin/genres/:genreId(\\d+)', function(req, res){
    let genre = {genre_name: req.body.genre_name, genre_id: req.params.genreId};
    genreDao.updateGenreName(genre, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        genreDao.getGenre(req.params.genreId, function(err1, result){
            if (err){
                res.status(500);
                res.send("Error updating name for genre:", req.params.genreId);
            }
            res.status(200);
            res.send(result);
        });
    });
});

routes.delete('/api/admin/genres/:genreId(\\d+)', function(req, res){
    genreDao.deleteGenre(req.params.genreId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(204);
        console.log("1 record deleted");
        res.send("Genre removed");
    });
});

routes.delete('/api/admin/genres/:genreId(\\d+)/book/:bookId(\\d+)', function(req, res){
    genreDao.removeGenreFromBook(req.params.genreId, req.params.bookId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(204);
        console.log("1 record altered");
        res.send("Book altered");
    });
});

routes.get('/api/admin/genres', function(req, res){
    genreDao.getAllGenres(function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result);
    })
});

routes.get('/api/admin/genres/:genreId(\\d+)/books', function(req, res){
    genreDao.getAllBooksForAGenre(req.params.genreId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result); 
    });
});

routes.get('/api/admin/loans', function(req, res){
    bookLoanDao.getAllBookLoans(function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result); 
    });
});


routes.patch('/api/admin/loan/dueDate', function(req, res){
    let bookLoan = req.body;
    bookLoanDao.changeDueDate(bookLoan, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        bookLoanDao.getAllBookLoans(function(err, result1){
            if (err){
                res.status(500);
                res.send("Not Found");
            }
            bookL = getBookLoanByDateOut(result, bookLoan.bookId, bookLoan.cardNo, bookLoan.dateOut);
            res.status(200);
            res.send(bookL);
        });
    });
});

routes.get('/api/admin/branches/:branchid(\\d+)/loans/current', function(req, res){
    bookLoanDao.getCurrentLoansForBranch(req.params.branchId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result);
    });
});

module.exports = routes;