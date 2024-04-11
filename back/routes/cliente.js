'use strict'

var express = require('express');
var clienteController = require('../controllers/ClienteController');

var api = express.Router();
var auth = require('../middlewares/authenticate');

// Cliente
api.post('/registro_cliente', clienteController.registro_cliente);
api.post('/login_cliente', clienteController.login_cliente);
api.post('/registro_y_login_cliente', clienteController.registro_y_login_cliente);
api.get('/obtener_cliente_guest/:id', auth.auth, clienteController.obtener_cliente_guest);
api.get('/listar_cliente_filtro_admin/:tipo/:filtro?', auth.auth, clienteController.listar_cliente_filtro_admin);
api.post('/registro_cliente_admin',auth.auth, clienteController.registro_cliente_admin);
api.get('/obtener_cliente_admin/:id', auth.auth, clienteController.obtener_cliente_admin);
api.put('/actualizar_cliente_admin/:id', auth.auth, clienteController.actualizar_cliente_admin);
api.delete('/eliminar_cliente_admin/:id', auth.auth, clienteController.eliminar_cliente_admin);
api.put('/actualizar_cliente_guest/:id', auth.auth, clienteController.actualizar_cliente_guest);

// Direcciones
api.post('/registro_direccion_cliente',auth.auth, clienteController.registro_direccion_cliente);
api.get('/obtener_direccion_cliente/:id', auth.auth, clienteController.obtener_direccion_cliente);
api.put('/cambiar_direccion_cliente_principal/:id/:cliente', auth.auth, clienteController.cambiar_direccion_cliente_principal);
api.get('/obtener_direccion_principal_cliente/:id', auth.auth, clienteController.obtener_direccion_principal_cliente);

// Contacto
api.post('/enviar_mensaje_contacto', clienteController.enviar_mensaje_contacto);
api.get('/obtener_mensajes_admin', auth.auth, clienteController.obtener_mensajes_admin);
api.put('/cerrar_mensajes_admin/:id', auth.auth, clienteController.cerrar_mensajes_admin);

// Ordenes
api.get('/obtener_ordenes_cliente/:id', auth.auth, clienteController.obtener_ordenes_cliente);
api.get('/obtener_detalle_ordene_cliente/:id', auth.auth, clienteController.obtener_detalle_ordene_cliente);

// Reviews
api.post('/emitir_review_producto_cliente',auth.auth, clienteController.emitir_review_producto_cliente);
api.get('/obtener_review_producto_cliente/:id', clienteController.obtener_review_producto_cliente);



module.exports = api;
