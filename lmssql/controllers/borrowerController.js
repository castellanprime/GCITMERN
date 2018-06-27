var routes = require("express").Router();
let bookLoanDao = require('../dao/bookLoanDao');
let borrowerDao = require('../dao/borrowerDao');

routes.post('/api/borrowers', function(req, res){
    borrowerDao.addBorrower(req.body, function(err, result){
        if (err){
            res.status(400);
            res.send('Add Borrower Failed');
        } 
        borrowerDao.getBorrower(result.insertId, function(err1, result1){
            if (err1){
                res.status(500);
                res.send("Error retrieving new created borrower with id: ", result.insertId);
            }
            res.status(201);
            console.log("1 record inserted");
            let objUrl = "/api/borrowers/" + result.insertId;
            res.location(objUrl);
            res.send(result1);
        }); 
    });
});


routes.post('/api/borrowers/:cardNo(\\d+)/loans', function(req, res){
    let bookLoan = {bookId: req.body.bookId, 
        branchId: req.body.branchId,
        cardNo: req.params.cardNo
    };
    bookLoanDao.addBookLoan(bookLoan, function(err, result){
        if (err){
            res.status(400);
            res.send("Check out failed");
        }
        console.log("BookLoan added: ", result.message);
        bookLoanDao.getCurrentLoansForBorrower(req.params.cardNo, function(err1, result1){
            if (err1){
                res.status(400);
                res.send("Error retrieving all loans for borrower with id: ", req.params.cardNo);
            }
            res.status(200);
            let st = result1.length + " Records Returned";
            console.log(st);
            res.send(result1);
        });
    })
});

routes.patch('/api/borrowers/:cardNo(\\d+)/loans', function(req, res){
    let bookLoan = {bookId: req.body.bookId, 
        branchId: req.body.branchId,
        cardNo: req.params.cardNo,
        dateOut: req.body.dateOut
    };
    bookLoanDao.removeBooKLoan(bookLoan, function(err, result){
        if (err){
            res.status(400);
            res.send("Return book failed");
        }
        console.log("Book returned: ", result.message);
        bookLoanDao.getCurrentLoansForBorrower(req.params.cardNo, function(err1, result1){
            if (err1){
                res.status(400);
                res.send("Error retrieving all loans for borrower with id: ", req.params.cardNo);
            }
            res.status(200);
            let st = result.length + " Records Returned";
            console.log(st);
            res.send(result1);
        });
    });
});

routes.get('/api/borrowers', function(req, res){
    borrowerDao.getAllBorrowers(function(err, result){
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

routes.patch('/api/borrowers/:cardNo(\\d+)', function(req, res){
    if (Reflect.has(req.body, 'name') === true){
        let borrower = Object.assign({}, req.body, {cardNo: req.params.cardNo});
        borrowerDao.updateBorrowerName(borrower, function(err, result){
            if (err){
                res.status(400);
                res.send("Update Borrower Name Failed");
            } 
        });
    } 
    if (Reflect.has(req.body, 'address') === true){
        let borrower = Object.assign({}, req.body, {cardNo: req.params.cardNo});
        borrowerDao.updateBorrowerAddress(borrower, function(err, result){
            if (err){
                res.status(400);
                res.send("Update Borrower Address Failed");
            }
        });
    }
    if (Reflect.has(req.body, 'phone') === true){
        let borrower = Object.assign({}, req.body, {cardNo: req.params.cardNo});
        borrowerDao.updateBorrowerPhone(borrower, function(err, result){
            if (err){
                res.status(400);
                res.send("Update Borrower Phone Failed");
            }
        });
    }
    borrowerDao.getBorrower(req.params.cardNo, function(err, result){
        if (err){
            res.status(400);
            res.send("Error retrieving borrower for id: ", req.params.cardNo);
        }
        res.status(200);
        console.log("1 record updated");
        res.send(result);
    });
});


routes.get('/api/borrowers/:cardNo(\\d+)/loans/all', function(req, res){
    bookLoanDao.getAllBookLoansForBorrower(req.params.cardNo, function(err, result){
        if (err){
            res.status(400);
            res.send("Error retrieving all loans for borrower with id: ", req.params.cardNo);
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result);
    });
});

routes.get('/api/borrowers/:cardNo(\\d+)/loans/current', function(req, res){
    bookLoanDao.getCurrentLoansForBorrower(req.params.cardNo, function(err, result){
        if (err){
            res.status(400);
            res.send("Error retrieving current loans for borrower with id: ", req.params.cardNo);
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result);
    });
});

routes.delete('/api/borrowers/:cardNo(\\d+)', function(req, res){
    borrowerDao.deleteBorrower(req.params.borrowerId, function(err, result){
        if (err){
            res.status(400);
            res.send("Bad Request");
        }
        res.status(204).send();
        console.log("1 record deleted");
    });
});

module.exports = routes;