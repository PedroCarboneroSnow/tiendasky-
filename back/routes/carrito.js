'use strict'

var express = require('express');
var carritoController = require('../controllers/CarritoController');

var api = express.Router();
var auth = require('../middlewares/authenticate');


api.post('/agregar_carrito_cliente', auth.auth, carritoController.agregar_carrito_cliente);
api.get('/obtener_carrito_cliente/:id', auth.auth, carritoController.obtener_carrito_cliente);
api.delete('/eliminar_carrito_cliente/:id', auth.auth, carritoController.eliminar_carrito_cliente);
api.put('/agregar_menos_carrito_cliente/:id', carritoController.agregar_menos_carrito_cliente);
api.put('/agregar_mas_carrito_cliente/:id', carritoController.agregar_mas_carrito_cliente);

// Para app mobile
api.get('/obtener_carrito_cliente_mobile/:id', carritoController.obtener_carrito_cliente_mobile);
api.delete('/eliminar_carrito_cliente_mobile/:id', carritoController.eliminar_carrito_cliente_mobile);

module.exports = api;
