'use strict'

var express = require('express');
var cuponController = require('../controllers/CuponController');

var api = express.Router();
var auth = require('../middlewares/authenticate');


api.get('/listar_cupon_admin/:filtro?', auth.auth, cuponController.listar_cupon_admin);
api.post('/registro_cupon_admin',auth.auth, cuponController.registro_cupon_admin);
api.get('/obtener_cupon_admin/:id', auth.auth, cuponController.obtener_cupon_admin);
api.put('/actualizar_cupon_admin/:id', auth.auth, cuponController.actualizar_cupon_admin);
api.delete('/eliminar_cupon_admin/:id', auth.auth, cuponController.eliminar_cupon_admin);
api.get('/validar_cupon_cliente/:cupon', auth.auth, cuponController.validar_cupon_cliente);


module.exports = api;
