'use strict'

var Cupon = require('../models/cupon');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt')
var fs = require('fs');
var path = require('path')


const registro_cupon_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            var data = req.body;
            
            let reg = await Cupon.create(data);

            res.status(200).send({
                data: reg,
            })
        } else{
            res.status(500).send({
                message: 'NoAccess'
            })
        }
    }else{
        res.status(500).send({
            message: 'NoAccess'
        })
    }
}

const listar_cupon_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            var filtro = req.params['filtro'];
            
            let reg = await Cupon.find({codigo: new RegExp(filtro, 'i')}).sort({createAt: -1});

            res.status(200).send({
                data: reg
            })

        } else{
            res.status(500).send({
                message: 'NoAccess'
            })
        }
    }else{
        res.status(500).send({
            message: 'NoAccess'
        })
    }
}

const obtener_cupon_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            // obtener id
            var id = req.params['id'];
            // Capturar el error
            try {
                var reg = await Cupon.findById({_id: id});
                res.status(200).send({
                    data: reg
                })
            } catch (error) {
                res.status(200).send({
                    data: undefined
                })
            }
        } else {
            res.status(500).send({
                message: 'NoAccess'
            })
        }
    } else {
        res.status(500).send({
            message: 'NoAccess'
        })
    }
}

const actualizar_cupon_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            
            var data = req.body;
            var id = req.params['id'];

            let reg = await Cupon.findByIdAndUpdate({_id:id}, {
                codigo: data.codigo,
                tipo: data.tipo,
                valor: data.valor,
                limite: data.limite
            })

            res.status(200).send({
                data: reg
            })
        } else {
            res.status(500).send({
                message: 'NoAccess'
            })
        }
    } else {
        res.status(500).send({
            message: 'NoAccess'
        })
    }
}

const eliminar_cupon_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            // obtener id
            var id = req.params['id'];
            let reg = await Cupon.findByIdAndDelete({_id:id});

            res.status(200).send({
                data: reg
            })
            

        } else {
            res.status(500).send({
                message: 'NoAccess'
            })
        }
    } else {
        res.status(500).send({
            message: 'NoAccess'
        })
    }
}


// Cliente 
const validar_cupon_cliente = async function(req, res){
    if (req.user) {

        var cupon = req.params['cupon'];
        
        var data = await Cupon.findOne({codigo: cupon});
        console.log(data)
        
        if(data){
            if(data.limite == 0){
                res.status(200).send({
                    data: undefined
                })
            }else{
                res.status(200).send({
                    data: data
                })
            }
        }else{
            res.status(200).send({
                data: undefined
            })
        }

    }else{
        res.status(500).send({
            message: 'NoAccess'
        })
    }
}


module.exports = {
    registro_cupon_admin,
    listar_cupon_admin,
    obtener_cupon_admin,
    actualizar_cupon_admin,
    eliminar_cupon_admin,
    validar_cupon_cliente
}



