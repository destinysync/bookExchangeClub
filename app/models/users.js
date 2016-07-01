'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	local: {
		id: String,
		password: String,
		books: Object
	}
});

module.exports = mongoose.model('User', User);
