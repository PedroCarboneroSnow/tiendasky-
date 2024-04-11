'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema = Schema({
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    venta: {type: Schema.ObjectId, ref: 'venta', required: true},
    review: {type: String, required: true},
    estrellas: {type: Number, required: true},
    createAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('review', ReviewSchema);