'use strict'

var debug = require('debug')('feriapp:controllers:fair');
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Admin = require('../models/admin');
var Fair = require('../models/fair');
var Plot = require('../models/plot');

function getFair(req, res) {
	var fairId = req.params.id;

	Fair.findById(fairId).populate({ path: 'admin' }).exec((err, fair) => {
		if (err) {
			res.status(500).send({ message: 'Error en la solicitud' });
		} else {
			if (!fair) {
				res.status(404).send({ message: 'No existe el fair' });
			} else {
				res.status(200).send({ fair });
			}

		}
	});
}

function getFairs(req, res) {
	var adminId = req.params.admin;

	if (!adminId) {
		//sacar todos los fairs de la DB
		var find = Fair.find({}).sort('title');
	} else {
		//sacar los fairs de un admina concreto de la DB
		var find = Fair.find({ admin: adminId }).sort('year');
	}

	find.populate({ path: 'admin' }).exec((err, fairs) => {
		if (err) {
			res.status(500).send({ message: 'Error en la solicitud' });
		} else {
			if (!fairs) {
				res.status(404).send({ message: 'No hay fairs' });
			} else {
				res.status(200).send({ fairs });
			}
		}
	});
}

function saveFair(req, res) {
	var fair = new Fair

	var params = req.body;
	fair.title = params.title;
	fair.description = params.description;
	fair.year = params.year;
	fair.image = 'null';
	fair.admin = params.admin;

	fair.save((err, fairStored) => {
		if (err) {
			res.status(500).send({ message: 'Error en el servidor' });
		} else {
			if (!fairStored) {
				resstatus(404).send({ message: 'No se haguardado el fair.' });
			} else {
				res.status(200).send({ fair: fairStored });
			}
		}

	});
}

function updateFair(req, res) {
	var fairId = req.params.id;
	var update = req.body;

	Fair.findByIdAndUpdate(fairId, update, (err, fairUpdated) => {
		if (err) {
			res.status(500).send({ message: 'Error en el servidor.' });
		} else {
			if (!fairUpdated) {
				res.status(404).send({ message: 'No se actualizó el fair.' });
			} else {
				res.status(200).send({ fair: fairUpdated });
			}
		}
	});
}

function deleteFair(req, res) {
	var fairId = req.params.id;

	Fair.findByIdAndRemove(fairId, (err, fairRemoved) => {
		if (err) {
			res.status(500).send({ message: 'Error al eliminar fair.' });
		} else {
			if (!fairRemoved) {
				res.status(404).send({ message: 'No se eliminó el fair.' });
			} else {

				Song.find({ fair: fairRemoved._id }).remove((err, songRemoved) => {
					if (err) {
						res.status(500).send({ message: 'Error al eliminar canción.' });
					} else {
						if (!songRemoved) {
							res.status(404).send({ message: 'No se eliminó la canción.' });
						} else {
							res.status(200).send({ fair: fairRemoved });
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res) {
	var fairId = req.params.id;
	var file_name = 'Imagen no subida...';
	var path = require('path');

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		debug(ext_split);

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'PNG' || file_ext == 'JPG' || file_ext == 'GIF' || file_ext == 'JPEG' || file_ext == 'jpeg') {
			Fair.findByIdAndUpdate(fairId, { image: file_name }, (err, fairUpdated) => {
				if (!fairUpdated) {
					res.status(404).send({ message: 'No se pudo actualizar el usuario' });
				} else {
					res.status(200).send({ fair: fairUpdated });
				}
			});
		} else {
			res.status(200).send({ message: 'Archivo no válido, sólo PNG, JPG o GIF' });
		}
	} else {
		res.status(200).send({ message: 'No se subio ninguna imagen...' });
		//}
	}
}

function getImageFile(req, res) {
	var imageFile = req.params.imageFile;
	var path_file = './uploads/fairs/' + imageFile;

	fs.exists(path_file, function (exists) {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({ message: 'No existe la imagen.' });
		}
	});
}


module.exports = {
	getFair,
	saveFair,
	getFairs,
	updateFair,
	deleteFair,
	uploadImage,
	getImageFile
};