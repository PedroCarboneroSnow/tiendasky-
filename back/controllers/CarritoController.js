var Carrito = require('../models/carrito');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt')
var fs = require('fs');
var path = require('path')

const agregar_carrito_cliente = async function(req, res){
    if (req.user){
        let data = req.body;

        let  carrito_cliente = await Carrito.find({cliente: data.cliente, producto: data.producto});

        if(carrito_cliente.length == 0){
            let reg = await Carrito.create(data);
            res.status(200).send({
                data: reg
            });
        } else if (carrito_cliente.length >= 1){
            res.status(200).send({
                data: undefined
            });
        }

        
    }else{
        res.status(500).send({
            data: 'NoAcces'
        });
    }
}



const agregar_mas_carrito_cliente = async function(req, res) {
    let id = req.params['id'];

    try {
        let reg = await Carrito.findById({_id: id}).populate('producto').populate('cliente');

        if (!reg) {
            return res.status(404).send({
                message: 'Carrito no encontrado'
            });
        }

        reg.cantidad = Number(reg.cantidad) + 1;
        let updatedReg = await reg.save();

        res.status(200).send({
            data: updatedReg
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Error en el servidor'
        });
    }
}


const agregar_menos_carrito_cliente = async function(req, res) {
    let id = req.params['id'];

    try {
        let reg = await Carrito.findById({_id: id}).populate('producto').populate('cliente');

        if (!reg) {
            return res.status(404).send({
                message: 'Carrito no encontrado'
            });
        }

        if (reg.cantidad <= 1) {
            return res.status(200).send({
                data: reg
            });
        }

        reg.cantidad = Number(reg.cantidad) - 1;
        let updatedReg = await reg.save().populate('producto').populate('cliente');

        res.status(200).send({
            data: updatedReg
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Error en el servidor'
        });
    }
}


const obtener_carrito_cliente = async function(req, res){
    if (req.user){
        let id = req.params['id'];

        let  carrito_cliente = await Carrito.find({cliente: id}).populate('producto').populate('cliente');

        res.status(200).send({
            data: carrito_cliente
        });

        
    }else{
        res.status(500).send({
            data: 'NoAcces'
        });
    }
}

const obtener_carrito_cliente_mobile = async function(req, res){
    let id = req.params['id'];

    let  carrito_cliente = await Carrito.find({cliente: id}).populate('producto').populate('cliente');

    res.status(200).send({
        data: carrito_cliente
    });
}

const eliminar_carrito_cliente = async function(req, res){
    if (req.user){
        let id = req.params['id'];

        let reg = await Carrito.findByIdAndRemove({_id: id});

        res.status(200).send({
            data: reg
        });
        
    }else{
        res.status(500).send({
            data: 'NoAcces'
        });
    }
}

const eliminar_carrito_cliente_mobile = async function(req, res){
    let id = req.params['id'];

        let reg = await Carrito.findByIdAndRemove({_id: id});

        res.status(200).send({
            data: reg
        });
}

module.exports = {
    agregar_carrito_cliente,
    obtener_carrito_cliente,
    eliminar_carrito_cliente,
    agregar_menos_carrito_cliente,
    agregar_mas_carrito_cliente,
    obtener_carrito_cliente_mobile,
    eliminar_carrito_cliente_mobile
}
