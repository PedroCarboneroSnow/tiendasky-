'use strict'

var express = require('express');
var VentaController = require('../controllers/VentaController');

var api = express.Router();
var auth = require('../middlewares/authenticate');


api.post('/registro_compra_cliente', auth.auth, VentaController.registro_compra_cliente);
api.get('/enviar_correo_compra_cliente/:id', auth.auth, VentaController.enviar_correo_compra_cliente);


// api.delete('/eliminar_carrito_cliente/:id', auth.auth, VentaController.eliminar_carrito_cliente);

// api.get('/listar_cliente_filtro_admin/:tipo/:filtro?', auth.auth, VentaController.listar_cliente_filtro_admin);
// api.post('/registro_cliente_admin',auth.auth, VentaController.registro_cliente_admin);
// api.get('/obtener_cliente_admin/:id', auth.auth, VentaController.obtener_cliente_admin);
// api.put('/actualizar_cliente_admin/:id', auth.auth, VentaController.actualizar_cliente_admin);

// api.put('/actualizar_cliente_guest/:id', auth.auth, clienteController.actualizar_cliente_guest);


module.exports = api;
