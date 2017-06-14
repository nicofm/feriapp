'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlotSchema = Schema({
	number: String,
	name: String,
	duration: String,
	file: String,
	fair: { type: Schema.ObjectId, ref: 'Fair' }
});

module.exports = mongoose.model('Plot', PlotSchema);