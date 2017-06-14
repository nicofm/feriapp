'use strict'

var express = require('express');
var AdminController = require('../controllers/admin');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/admins' });

api.get('/admin/:id', md_auth.ensureAuth, AdminController.getAdmin);
api.post('/admin', md_auth.ensureAuth, AdminController.saveAdmin);
api.get('/admins/:page?', md_auth.ensureAuth, AdminController.getAdmins);
api.put('/admin/:id', md_auth.ensureAuth, AdminController.updateAdmin);
api.delete('/admin/:id', md_auth.ensureAuth, AdminController.deleteAdmin);
api.post('/upload-image-admin/:id', [md_auth.ensureAuth, md_upload], AdminController.uploadImage);
api.get('/get-image-admin/:imageFile', AdminController.getImageFile);

module.exports = api;