'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FairSchema = Schema({
	title: String,
	description: String,
	year: String, //o date? y location?
	image: String,
	admin: { type: Schema.ObjectId, ref: 'Admin' }
});

module.exports = mongoose.model('Fair', FairSchema);