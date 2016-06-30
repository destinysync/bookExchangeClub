'use strict';

var Yelp = require('yelp');
var path = process.cwd();
var passport = require('passport');

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
        console.log('here');
        require('https').request({
            host: 'googleapis.com',
            path: '/books/v1/volumes?q=flowers+inauthor:keyes&key=AIzaSyAoXm0EJoHGtxLnyJyammD_bNoNNFS0RGs',
            method: 'GET'
        }, function(res) {
            console.log('here 2');
            res.setEncoding('utf8');
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                body = JSON.parse(body);
                console.log(body);
            })
        }).end();
    }
}

module.exports = ClickHandler;
