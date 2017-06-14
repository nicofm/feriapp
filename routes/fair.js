'use strict'

var express = require('express');
var FairController = require('../controllers/fair');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/fairs' });

api.get('/fair/:id', md_auth.ensureAuth, FairController.getFair);
api.post('/fair', md_auth.ensureAuth, FairController.saveFair);
api.get('/fairs/:admin?', md_auth.ensureAuth, FairController.getfairs);
api.put('/fair/:id', md_auth.ensureAuth, FairController.updateFair);
api.delete('/fair/:id', md_auth.ensureAuth, FairController.deleteFair);
api.post('/upload-image-fair/:id', [md_auth.ensureAuth, md_upload], FairController.uploadImage);
api.get('/get-image-fair/:imageFile', FairController.getImageFile);


module.exports = api;