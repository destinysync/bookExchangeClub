'use strict';

var path = process.cwd();
var User = require('../models/users');
var _ = require('underscore');

function generateRequestsToMeBookDivs(bookObj, req, res) {
    var userID = req.user._id;
    var fullBookDivs = '';
    var count = 0;

    for (var i = 0; i < bookObj.length; i++) {
        var divPart1 = "<div class='col-lg-2 bookDiv " + bookObj[i].userID + "' id='" + bookObj[i].bookID + "'><div class='bookContainer'><img src='" + bookObj[i].imgLink,
            divPart2 = "' /><div class='bookContainerBG'><div class='approveRequestToMeButton'><span class='glyphicon glyphicon-ok'><b></b></span></div><div class='deleteRequestToMeButton'><span><b>X</b></span></div></div></div></div>",
            fullBookDiv = divPart1 + divPart2;
        fullBookDivs += fullBookDiv;
        count++;
    }

    if (count == bookObj.length) {
        res.end(fullBookDivs);
    }
}

function generateRequestsToOthersBookDivs(bookObj, req, res) {

    var fullBookDivs = '';
    var count = 0;

    for (var i = 0; i < bookObj.length; i++) {
        var divPart1 = "<div class='col-lg-4 bookDiv " + bookObj[i].bookOwnerID + "' id='" + bookObj[i].bookID + "'><div class='bookContainer'><img src='" + bookObj[i].imgLink,
            divPart2 = "' /><div class='bookContainerBG'><div class='delRequestsToOthersButton'><span><b>X</b></span></div></div></div></div>",
            fullBookDiv = divPart1 + divPart2;
        fullBookDivs += fullBookDiv;
        count++;
    }

    if (count == bookObj.length) {
        res.end(fullBookDivs);
    }
}

function generateUserBookDivs(bookObj, req, res) {

    var fullBookDivs = '';
    var count = 0;

    for (var i = 0; i < bookObj.length; i++) {
        var divPart1 = "<div class='col-lg-2 bookDiv " + bookObj[i].userID + "' id='" + bookObj[i].bookID + "'><div class='bookContainer'><img src='" + bookObj[i].imgLink,
            divPart2 = "' /><div class='bookContainerBG'><div class='deleteButton'><span><b>X</b></span></div></div></div></div>",
            fullBookDiv = divPart1 + divPart2;
        fullBookDivs += fullBookDiv;
        count++;
    }

    if (count == bookObj.length) {
        res.end(fullBookDivs);
    }
}

function generateAllBookDivs(bookObj, req, res) {

    var fullBookDivs = '';
    var count = 0;

    for (var i = 0; i < bookObj.length; i++) {
        var divPart1 = "<div class='col-lg-2 bookDiv " + bookObj[i].userID + "' id='" + bookObj[i].bookID + "'><div class='bookContainer'><img class='bookCover' src='" + bookObj[i].imgLink,
            divPart2 = "' /><div class='bookContainerBG'><div class='deleteButton'><span class='glyphicon glyphicon-retweet'></span></div></div></div></div>",
            fullBookDiv = divPart1 + divPart2;
        fullBookDivs += fullBookDiv;
        count++;
    }

    if (count == bookObj.length) {
        res.end(fullBookDivs);
    }
}

function ClickHandler() {

    this.delRequestsToOthers = function(req, res) {
        var bookID = req.url.match(/\/delRequestsToOthers\/(.*)&.*/)[1],
            ownerID = req.url.match(/&(.*)/)[1];

console.log(bookID + "     " + ownerID);

        if (req.isAuthenticated()) {
            User.findOneAndUpdate({
                '_id': req.user._id
            }, {
                $pull: {
                    'local.requestsToOthers': {
                        'bookID': bookID
                    }
                }
            }, {
                new: true
            }, function(err, result) {
                
                if (err) throw err;
                console.log(result);
                res.end('del');
            })


            User.findOneAndUpdate({
                '_id': ownerID
            }, {
                $pull: {
                    'local.requestsToMe': {
                        'bookID': bookID
                    }
                }
            }, {
                new: true
            }, function(err, result) {
                
                if (err) throw err;
                res.end('del');
            });


        }

    };

    this.deleteRequestToMe = function(req, res) {
        var bookID = req.url.match(/\/deleteRequestToMe\/(.*)/)[1];

        if (req.isAuthenticated()) {
            User.findOneAndUpdate({
                '_id': req.user._id
            }, {
                $pull: {
                    'local.requestsToMe': {
                        'bookID': bookID
                    }
                }
            }, {
                new: true
            }, function(err, result) {
                if (err) throw err;
                res.end('del');
            });
        }
    };

    this.requestsToMe = function(req, res) {
        if (req.isAuthenticated()) {
            User.find({
                '_id': req.user._id
            }, function(err, result) {
                if (err) throw err;
                generateRequestsToMeBookDivs(result[0].local.requestsToMe, req, res);
            });
        }
    };

    this.requestsToOthers = function(req, res) {
        if (req.isAuthenticated()) {
            User.find({
                '_id': req.user._id
            }, function(err, result) {
                if (err) throw err;
                generateRequestsToOthersBookDivs(result[0].local.requestsToOthers, req, res);
            })
        }
    }


    this.sendTradeRequest = function(req, res) {
        var url = req.url,
            imgLink = url.match(/\/sendTradeRequest\/imgLink=(.*)&/)[1],
            bookID = url.match(/&bookID=(.*)&/)[1],
            bookOwnerID = url.match(/&bookOwnerID=(.*)/)[1],
            requesterID = req.user._id,
            bookObj = {
                'imgLink': imgLink,
                'bookID': bookID,
                'bookOwnerID': bookOwnerID,
                'requesterID': requesterID
            };

        User.findOneAndUpdate({
            '_id': bookOwnerID
        }, {
            $push: {
                'local.requestsToMe': bookObj
            }
        }, {
            new: true
        }, function(err, result) {
            if (err) throw err;
        });

        User.findOneAndUpdate({
            '_id': requesterID
        }, {
            $push: {
                'local.requestsToOthers': bookObj
            }
        }, {
            new: true
        }, function(err, result) {
            if (err) throw err;
        });

    };


    this.changePassword = function(req, res) {
        var currentPassword = req.url.match(/currentPassword=(.*)&.*/)[1],
            newPassword = req.url.match(/&newPassword=(.*)/)[1];
        User.find({
            _id: req.user._id
        }, function(err, data) {

            if (err) throw err;
            if (data[0].local.password == currentPassword) {
                User.findOneAndUpdate({
                    '_id': req.user._id
                }, {
                    $set: {
                        'local.password': newPassword
                    }
                }, {
                    new: true
                }, function(err, data) {
                    if (err) throw err;
                    
                })
            }
        })
    }


    this.getProfile = function(req, res) {

        
        var content = '<div class="col-lg-4 col-lg-offset-4"><form role="form" class="profileForm" id="userGeolocationForm"><div class="form-group"><label for="City"> City </label><input name="currentPassword" type="text" class="form-control" id="City"></div><div class="form-group"><label for="State"> State </label><input name="newPassword" type="text" class="form-control" id="State"></div></form><button type="submit" class="btn btn-primary" id="userGeoInfoResetButton">Submit</button><form role="form" class="profileForm" id="passwordResetForm"><div class="form-group"><label for="pwd"> Current Password:</label><input name="currentPassword" type="password" class="form-control" id="pwd"></div><div class="form-group"><label for="pwd">New Password:</label><input name="newPassword" type="password" class="form-control" id="pwd"></div></form><button type="submit" class="btn btn-primary" id="passwordRestButton">Submit</button></div>';
        res.end(content);
    };


    this.displayAllBooks = function(req, res) {
        var allBookObjArray = [],
            count = 0;

        if (req.isAuthenticated()) {
            User.find({}, function(err, data) {
                if (err) throw err;
                if (data !== undefined) {
                    for (var i = 0; i < data.length; i++) {

                        if (JSON.stringify(data[i]._id) != JSON.stringify(req.user._id)) {

                            for (var j = 0; j < data[i].local.books.length; j++) {
                                allBookObjArray.push(data[i].local.books[j]);
                            }
                        }

                        count++;
                    }
                    if (count == data.length) {
                        generateAllBookDivs(allBookObjArray, req, res);
                    }

                }

            })
        }
        else {
            User.find({}, function(err, data) {
                if (err) throw err;

                if (data !== undefined) {
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < data[i].local.books.length; j++) {
                            allBookObjArray.push(data[i].local.books[j]);
                        }
                        count++;
                    }
                    if (count == data.length) {
                        generateAllBookDivs(allBookObjArray, req, res);
                    }

                }

            })
        }


    }


    this.delMyBookFromDB = function(req, res) {
        var bookID = req.url.match(/\/delMyBookFromDB\/(.*)/)[1];

        if (req.isAuthenticated()) {
            User.findOneAndUpdate({
                'local.id': req.user.local.id
            }, {
                $pull: {
                    'local.books': {
                        bookID: bookID
                    }
                }
            }, {
                new: true
            }, function(err, data) {
                if (err) throw err;
                res.end();
            })
        }
    };


    this.changeLoginIcon = function(req, res) {
        var content = '';
        if (req.isAuthenticated()) {
            content = '<div><a href="/profile"><span class="glyphicon glyphicon-user profileIcon" aria-hidden="true"></span></a><div class="logOut"><a href="/logout"><span>Log Out</span></a></div></div>';
            res.end(content);
        }
        else {
            content = '<div class="signIconDiv"><span class="glyphicon glyphicon-user" aria-hidden="true"></span><div class="signIn"><span class="signInText">Sign In</span></div></div><div class="signInBoxDiv"><div class="signInBox"><form action="/signInOrSignUp/" method="post"><div class="form-group"><label for="Email">Email address</label><input type="email" class="form-control" name="username" id="Email" placeholder="Email" value=""><div class="emailInUseAlert"><i>Try Again, Email In Use.</i></div></div><div class="form-group"><label for="Password">Password</label><input type="password" class="form-control" name="password" id="Password" placeholder="Password"></div><button type="submit" id="signUpSubmit" class="btn btn-default">Submit</button></form><div id="signUpDes"><b>Not Yet Signed Up?</b><i>Fill In And Submit To Join!</i></div></div></div>';
            res.end(content);
        }
    };

    this.addBooks = function(req, res) {

        var json = '',
            imgLink = '',
            title = '',
            bookObj = '',
            userID = req.user._id,
            bookID = '';

        function sendJSON() {
            json = JSON.parse(json);
            imgLink = json.items[0].volumeInfo.imageLinks.thumbnail;
            title = json.items[0].volumeInfo.title;
            bookID = json.items[0].id;

            bookObj = {
                imgLink: imgLink,
                title: title,
                bookID: bookID,
                userID: userID
            }

            User.findOneAndUpdate({
                '_id': req.user._id
            }, {
                $push: {
                    'local.books': bookObj
                }
            }, {
                new: true
            }, function(err, data) {
                if (err) throw err;

            });
            generateUserBookDivs([bookObj], req, res);
        }

        var keyword = req.url.match(/\/addBooks\/(.*)/)[1],
            path = '/books/v1/volumes?q=' + keyword + '&key=AIzaSyAoXm0EJoHGtxLnyJyammD_bNoNNFS0RGs';

        function getJSON(callback) {
            require('https').request({
                host: 'www.googleapis.com',
                path: path,
                method: 'GET'
            }, function(res) {
                res.setEncoding('utf8');
                var body = '';
                res.on('data', function(chunk) {
                    body += chunk;
                });
                res.on('end', function() {
                    json = body;
                    callback();
                });
            }).end();
        }
        getJSON(sendJSON);
    };

    this.displayMyBooks = function(req, res) {
        if (req.isAuthenticated()) {
            var myBooksOjb = req.user.local.books;
            generateUserBookDivs(myBooksOjb, req, res);
        }
    }
}

module.exports = ClickHandler;
