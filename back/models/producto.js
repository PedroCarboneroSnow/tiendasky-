'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = Schema({
    titulo: {type: String, require: true},
    slug: {type: String, require: true},
    marca: {type: String, require: true},
    galeria: [{type: Object, require: false}],
    portada: {type: String, require: true},
    precio: {type: Number, require: true},
    descripcion: {type: String, require: true},
    contenido: {type: String, require: true},
    stock: {type: Number, require: true},
    nventas: {type: Number, default: 0 ,require: true},
    categoria: {type: String, require: true},
    npuntos: {type: Number, default: 0 ,require: true},
    estado: {type: String, default: 'Edicion', require: true},
    createAt: {type: Date, default: Date.now, require: true},
    variedades: [{type: Object, require: false}],
    titulo_variedad : {type: String, require: false}
});

module.exports = mongoose.model('producto', productoSchema);