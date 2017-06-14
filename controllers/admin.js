'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Admin = require('../models/admin');
var Fair = require('../models/fair');
var Plot = require('../models/plot');

function getAdmin(req, res) {
	var admin = req.params.id;

	Admin.findById(adminId, (err, admin) => {
		if (err) {
			res.status(500).send({ message: 'Error en la solicitud.' });
		} else {
			if (!admin) {
				res.status(404).send({ message: 'El ferista no existe.' });
			} else {
				res.status(200).send({ admin });
			}
		}
	});

}

function getAdmins(req, res) {
	if (req.params.page) {
		var page = req.params.page;
	} else {
		var page = 1;
	}

	var itemsPerPage = 3

	Admin.find().sort('name').paginate(page, itemsPerPage, function (err, admins, total) {
		if (err) {
			res.status(500).send({ message: 'Error en la solicitud.' });
		} else {
			if (!admins) {
				res.status(404).send({ message: 'No hay feristas!' });
			} else {
				return res.status(200).send({
					total_items: total,
					admins: admins
				});
			}
		}
	});
}

function saveAdmin(req, res) {
	var admin = new Admin();

	var params = req.body;
	admin.name = params.name;
	admin.description = params.description;
	admin.image = 'null';

	admin.save((err, adminStored) => {
		if (err) {
			res.status(500).send({ message: 'Error al guardar el ferista.' });
		} else {
			if (!adminStored) {
				res.status(404).send({ message: 'El ferista no ha sido guardado' });
			} else {
				res.status(200).send({ admin: adminStored });
			}
		}
	});

}

function updateAdmin(req, res) {
	var adminId = req.params.id;
	var update = req.body;

	Admin.findByIdAndUpdate(adminId, update, (err, adminUpdated) => {
		if (err) {
			res.status(500).send({ message: 'Error al guardar ferista.' });
		} else {
			if (!adminUpdated) {
				res.status(404).send({ message: 'No se actualizó el ferista.' });
			} else {
				res.status(200).send({ admin: adminUpdated });
			}
		}
	});
}

function deleteAdmin(req, res) {
	var adminId = req.params.id;

	Admin.findByIdAndRemove(adminId, (err, adminRemoved) => {
		if (err) {
			res.status(500).send({ message: 'Error al eliminar ferista.' });
		} else {
			if (!adminRemoved) {
				res.status(404).send({ message: 'No se eliminó el ferista.' });
			} else {

				Fair.find({ admin: adminRemoved._id }).remove((err, fairRemoved) => {
					if (err) {
						res.status(500).send({ message: 'Error al eliminar feria.' });
					} else {
						if (!fairRemoved) {
							res.status(404).send({ message: 'No se eliminó el feria.' });
						} else {

							Plot.find({ fair: fairRemoved._id }).remove((err, plotRemoved) => {
								if (err) {
									res.status(500).send({ message: 'Error al eliminar parcela.' });
								} else {
									if (!plotRemoved) {
										res.status(404).send({ message: 'No se eliminó la parcela.' });
									} else {
										res.status(200).send({ admin: adminRemoved });
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res) {
	var adminId = req.params.id;
	var file_name = 'Imagen no subida...';
	var path = require('path');

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		//ver el file split para que funcione en el hosting
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		//console.log(ext_split);

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'PNG' || file_ext == 'JPG' || file_ext == 'GIF' || file_ext == 'JPEG' || file_ext == 'jpeg') {

			Admin.findByIdAndUpdate(adminId, { image: file_name }, (err, adminUpdated) => {
				if (!adminUpdated) {
					res.status(404).send({ message: 'No se pudo actualizar el usuario' });
				} else {
					res.status(200).send({ admin: adminUpdated });
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
	var path_file = './uploads/admins/' + imageFile;

	fs.exists(path_file, function (exists) {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({ message: 'No existe la imagen.' });
		}
	});
}


module.exports = {
	getAdmin,
	saveAdmin,
	getAdmins,
	updateAdmin,
	deleteAdmin,
	uploadImage,
	getImageFile
};
