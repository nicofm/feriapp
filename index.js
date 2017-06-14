'use strict'

var mongoose = require('mongoose');
var debug = require('debug')('feriapp:index');
var config = require('config').get('config');
var app = require('./app');
var port = config.serverHttp.port

mongoose.connect(config.mongoUrl, (err, res) => {
	if (err) {
		throw err;
	} else {
		debug("La conexión a la base de datos está funcionando correctamente...");

		app.listen(port, function () {
			debug(`Servidor del api rest en http://localhost:${port}`);
		});
	}
});