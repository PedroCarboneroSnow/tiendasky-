'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DescuentoSchema = Schema({
    titulo: {type: String, required: true},
    banner: {type: String, required: true}, 
    descuento: {type: Number, required: true}, // Porcentaje o precio fijo
    fecha_inicio: {type: String, required: true}, 
    fecha_fin: {type: String, required: true},
    createAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('descuento', DescuentoSchema);