'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DventaSchema = Schema({
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    venta: {type: Schema.ObjectId, ref: 'venta', required: true},
    subtotal: {type: Number, required: true},
    precio: {type: Number, required: true},
    cantidad: {type: Number, required: true},
    variedad: {type: String, required: true},
    createAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('dventa', DventaSchema);