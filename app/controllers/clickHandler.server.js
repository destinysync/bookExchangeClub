'use strict';

var path = process.cwd();
var User = require('../models/users');
var _ = require('underscore');

function generateUserBookDivs(imgLinkArray, req, res) {
    
    var fullBookDivs = '';
    var count = 0;
    
    for (var i = 0; i < imgLinkArray.length; i++) {
            var divPart1 = "<div class='col-lg-2 bookDiv' id='" + req.user._id + "'><div class='bookContainer'><img src='" + imgLinkArray[i],
            divPart2 = "' /><div class='bookContainerBG'><div class='deleteButton'><span><b>X</b></span></div></div></div></div>",
            fullBookDiv = divPart1 + divPart2;
            fullBookDivs += fullBookDiv;
            count ++;
    }

    if (count == imgLinkArray.length) {
        res.end(fullBookDivs);
    }
}

function ClickHandler() {

    this.changeLoginIcon = function (req, res) {
        var content = '';
        if (req.isAuthenticated()) {
            content = '<div><a href="/profile"><span class="glyphicon glyphicon-user profileIcon" aria-hidden="true"></span></a><div class="logOut"><a href="/logout"><span>Log Out</span></a></div></div>';
            res.end(content);
        } else {
            content = '<div class="signIconDiv"><span class="glyphicon glyphicon-user" aria-hidden="true"></span><div class="signIn"><span class="signInText">Sign In</span></div></div><div class="signInBoxDiv"><div class="signInBox"><form action="/signInOrSignUp/" method="post"><div class="form-group"><label for="Email">Email address</label><input type="email" class="form-control" name="username" id="Email" placeholder="Email" value=""><div class="emailInUseAlert"><i>Try Again, Email In Use.</i></div></div><div class="form-group"><label for="Password">Password</label><input type="password" class="form-control" name="password" id="Password" placeholder="Password"></div><button type="submit" id="signUpSubmit" class="btn btn-default">Submit</button></form><div id="signUpDes"><b>Not Yet Signed Up?</b><i>Fill In And Submit To Join!</i></div></div></div>';
            res.end(content);
        }
    };
    
    this.addBooks = function (req, res) {

        var json = '',
        imgLink = '',
        title = '',
        obj = '';
        
        function sendJSON() {
            json = JSON.parse(json);
            imgLink = json.items[0].volumeInfo.imageLinks.thumbnail;
            title = json.items[0].volumeInfo.title;
            obj = {
                imgLink: imgLink,
                title: title
            }
            
            User.findOneAndUpdate({
                '_id': req.user._id
            }, {
                $push: {
                    'local.books': obj
                }
            }, {
                new: true
            }, function (err, data) {
                if (err) throw err;
             
            });
            generateUserBookDivs([imgLink], req, res);
        }
        
        var keyword = req.url.match(/\/addBooks\/(.*)/)[1],
        path = '/books/v1/volumes?q='+ keyword + '&key=AIzaSyAoXm0EJoHGtxLnyJyammD_bNoNNFS0RGs';
        
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
    
    this.displayMyBooks = function (req, res) {
        if (req.isAuthenticated()) {
                   var myBooksOjb = req.user.local.books;
        var imgLinkArray = _.pluck(myBooksOjb, 'imgLink');
        generateUserBookDivs(imgLinkArray, req, res); 
        }
    }
}

module.exports = ClickHandler;
