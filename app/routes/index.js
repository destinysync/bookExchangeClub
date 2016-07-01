'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport) {

	// function isLoggedIn (req, res, next) {
	// 	if (req.isAuthenticated()) {
	// 		return next();
	// 	} else {
	// 		res.redirect('/login');
	// 	}
	// }

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/auth/local')
		.post(passport.authenticate('local', { failureRedirect: '/login' }),
			function(req, res) {
				res.redirect('/');
			});

	app.route('/signInOrSignUp/')
		.post( passport.authenticate('signup', {
			successRedirect: '/profile',
			failureRedirect: '/',
			failureFlash : true
		}));
	
	app.route('/changeLoginIcon')
		.post(clickHandler.changeLoginIcon);
	
	app.route('/profile')
		.get(function(req, res) {
			if (req.isAuthenticated()) {
				res.sendFile(path + '/public/profile.html');
			} else {
				res.redirect('/');
			}
		});
	
	
	app.route('/displayMyBooks')
	.post(clickHandler.displayMyBooks);
	
	app.route('/addBooks/*')
		.post(clickHandler.addBooks);
		
		app.route('/delMyBookFromDB/*')
		.post(clickHandler.delMyBookFromDB);
		
		app.route('/displayAllBooks')
		.get(clickHandler.displayAllBooks);
		
		app.route('/isAuthenticated')
		.post(function (req, res) {
			if (req.isAuthenticated()) {
				res.json({
					'auth': 'true',
					'userID': req.user._id
				});
			} else {
				res.json({
					'auth': 'false',
					'userID': req.user._id
				});
			}
		})
	
};
