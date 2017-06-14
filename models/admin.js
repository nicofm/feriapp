'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Habria que agregar las Fairs del admin, aunque en el modelo de fairs, esta especificado
var AdminSchema = Schema({
	name: String,
	description: String,
	image: String,
});

module.exports = mongoose.model('Admin', AdminSchema);