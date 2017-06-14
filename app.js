'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas
var user_routes = require('./routes/user');
var admin_routes = require('./routes/admin');
var fair_routes = require('./routes/fair');
var plot_routes = require('./routes/plot');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// configurar cabeceras http

// rutas base
app.use('/api', user_routes);
app.use('/api', admin_routes);
app.use('/api', fair_routes);
app.use('/api', plot_routes);

module.exports = app;