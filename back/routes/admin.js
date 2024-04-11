'use strict'

var express = require('express');
var AdminController = require('../controllers/AdminController');


var api = express.Router();
var auth = require('../middlewares/authenticate');

api.post('/registro_admin', AdminController.registro_admin);
api.post('/login_admin', AdminController.login_admin);
api.get('/obtener_ventas_admin/:desde?/:hasta?', auth.auth, AdminController.obtener_ventas_admin);
api.get('/kpi_ganancias_mensuales_admin', auth.auth, AdminController.kpi_ganancias_mensuales_admin);



module.exports = api;