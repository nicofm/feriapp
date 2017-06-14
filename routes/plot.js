'use strict'

var express = require('express');
var PlotContoller = require('../controllers/plot');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/plots' });

api.get('/plot/:id', md_auth.ensureAuth, PlotContoller.getPlot);
api.post('/plot', md_auth.ensureAuth, PlotContoller.savePlot);
api.get('/plots/:fair?', md_auth.ensureAuth, PlotContoller.getPlots);
api.put('/plot/:id', md_auth.ensureAuth, PlotContoller.updatePlot);
api.delete('/plot/:id', md_auth.ensureAuth, PlotContoller.deletePlot);
api.post('/upload-file-plot/:id', [md_auth.ensureAuth, md_upload], PlotContoller.uploadFile);
api.get('/get-plot-file/:plotFile', PlotContoller.getPlotFile);



module.exports = api;