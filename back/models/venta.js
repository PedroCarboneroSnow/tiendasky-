'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VentaSchema = Schema({
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: false},
    nventa: {type: String, required: false},
    subtotal: {type: Number, required: false},
    envio_titulo: {type: String, required: false},
    envio_precio: {type: Number, required: false},
    transaccion: {type: String, required: false},
    cupon: {type: String, required: false},
    estado: {type: String, required: false},
    direccion: {type: Schema.ObjectId, ref: 'direccion', required: false},
    nota: {type: String, required: false},
    createAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('venta', VentaSchema);