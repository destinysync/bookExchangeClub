'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');


var app = express();
app.use(cookieParser());
require('./app/config/passport')(passport);

mongoose.connect("mongodb://admin:admin2020@ds015720.mlab.com:15720/heroku_8mmg8q9c");
// mongoose.connection.on('open', function(){
//     mongoose.connection.db.dropDatabase(function(err){
//     console.log(err);
//     });
// });

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

// app.set('view engine', 'ejs');
// app.set('views', (process.cwd() + '/public'));
app.use(express.static(process.cwd() + '/public'));


app.use(bodyParser.urlencoded({extended: false}));

app.use(flash());
app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});