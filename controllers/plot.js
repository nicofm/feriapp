'use strict'
//el plot tiene feria, y feriante (usuario o no de la app nativa), ver como coordinar ambos feriantes en el caso del que no es usuario de la app nativa, que rol tendria?
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Admin = require('../models/admin');
var Fair = require('../models/fair');
var Plot = require('../models/plot');

function getplot(req, res) {
	var plotId = req.params.id;

	Plot.findById(plotId).populate({ path: 'fair' }).exec((err, plot) => {
		if (err) {
			res.status(500).send({ message: 'Error en la solicitud.' });
		} else {
			if (!plot) {
				res.status(404).send({ message: 'La parcela no existe.' });
			} else {
				res.status(200).send({ plot });
			}
		}
	});
}

function getplots(req, res) {
	var fairId = req.params.fair;

	if (!fairId) {
		var find = Plot.find({}).sort('number');
	} else {
		var find = Plot.find({ fair: fairId }).sort('number');
	}
	find.populate({
		path: 'fair',
		populate: {
			path: 'admin',
			model: 'Admin'
		}
	}).exec(function (err, plots) {
		if (err) {
			res.status(500).send({ message: 'Error en la solicitud.' });
		} else {
			if (!plots) {
				res.status(404).send({ message: 'No hay parcelas!' });
			} else {
				res.status(200).send({ plots });
			}
		}
	});
}

function saveplot(req, res) {
	var plot = new Plot();

	var params = req.body;
	plot.number = params.number;
	plot.name = params.name;
	plot.duration = params.duration;
	plot.file = null;
	plot.fair = params.fair;

	plot.save((err, plotStored) => {
		if (err) {
			res.status(500).send({ message: 'Error en el servidor.' });
		} else {
			if (!plotStored) {
				res.status(404).send({ message: 'No se ha guardado la parcela.' });
			} else {
				res.status(200).send({ plot: plotStored });
			}
		}
	});
}

function updateplot(req, res) {
	var plotId = req.params.id;
	var update = req.body;

	Plot.findByIdAndUpdate(plotId, update, (err, plotUpdated) => {
		if (err) {
			res.status(500).send({ message: 'Error en el servidor.' });
		} else {
			if (!plotUpdated) {
				res.status(404).send({ message: 'No se ha actualizado la parcela.' });
			} else {
				res.status(200).send({ plot: plotUpdated });
			}
		}
	});
}

function deleteplot(req, res) {
	var plotId = req.params.id;
	Plot.findByIdAndRemove(plotId, (err, plotRemoved) => {
		if (err) {
			res.status(500).send({ message: 'Error en el servidor.' });
		} else {
			if (!plotRemoved) {
				res.status(404).send({ message: 'No se ha eliminado la parcela.' });
			} else {
				res.status(200).send({ plot: plotRemoved });
			}
		}
	});
}

function uploadFile(req, res) {
	var plotId = req.params.id;
	var file_name = 'Parcela no subida...';
	var path = require('path');

	if (req.files) {
		var file_path = req.files.file.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		//ver tipo de archivo para parcelas
		if (file_ext == '#' || file_ext == '#' || file_ext == '#' || file_ext == '#') {

			Plot.findByIdAndUpdate(plotId, { file: file_name }, (err, plotUpdated) => {
				if (!plotUpdated) {
					res.status(404).send({ message: 'No se pudo actualizar la parcela' });
				} else {
					res.status(200).send({ plot: plotUpdated });
				}
			});
		} else {
			res.status(200).send({ message: 'Archivo no válido' });
		}
	} else {
		res.status(200).send({ message: 'No se subio ningun archivo...' });
	}
}

function getplotFile(req, res) {
	var imageFile = req.params.plotFile;
	var path_file = './uploads/plots/' + plotFile;

	fs.exists(path_file, function (exists) {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({ message: 'No existe el archivo.' });
		}
	});
}


module.exports = {
	getPlot,
	getPlots,
	savePlot,
	updatePlot,
	deletePlot,
	uploadFile,
	getPlotFile
};
