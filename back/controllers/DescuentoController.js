'use strict'

var Descuento = require('../models/descuento');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt')
var fs = require('fs');
var path = require('path')


const registro_descuento_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            var data = req.body;

            var img_path = req.files.banner.path;
            var name = img_path.split('\\');
            var banner_name = name[2];

            data.banner = banner_name;
            let reg = await Descuento.create(data);

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

const listar_descuentos_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            var filtro = req.params['filtro'];
            var reg;

            if (filtro) {
                reg = await Descuento.find({titulo: new RegExp(filtro, 'i')}).sort({createAt: -1});
            } else {
                reg = await Descuento.find().sort({createAt: -1});
            }

            res.status(200).send({
                data: reg
            })

            console.log(reg)

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

const obtener_banner = async function(req, res){
    var img = req.params['img'];
    // console.log(img)
    fs.stat('./uploads/descuentos/'+img, function(err){
        if (!err){
            let img_path = './uploads/descuentos/'+img;
            res.status(200).sendFile(path.resolve(img_path))
        }else{
            let img_path = './uploads/img_defecto.png';
            res.status(200).sendFile(path.resolve(img_path))
            console.log('Aqui')
        }
    });
}

const obtener_descuento_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            // obtener id
            var id = req.params['id'];

            // Capturar el error
            try {
                var reg = await Descuento.findById({_id: id});
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

const actualizar_descuento_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            let id = req.params['id'];

            var data = req.body;

            if(req.files){
                var data = req.body;
                var img_path = req.files.banner.path;
                var name = img_path.split('\\');
                var banner_name = name[2];
                data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,'')

                var reg = await Descuento.findByIdAndUpdate({_id:id},{
                    titulo: data.titulo,
                    banner: banner_name, 
                    descuento: data.descuento, // Porcentaje o precio fijo
                    fecha_inicio: data.fecha_inicio, 
                    fecha_fin: data.fecha_fin
                });

                // Eliminar portada anterior
                fs.stat('./uploads/descuentos/'+reg.banner, function(err){
                    if(!err){
                        fs.unlink('./uploads/descuentos/'+reg.banner, (err)=>{
                            if (err) throw err;
                        });
                    }
                });

                res.status(200).send({
                    data: reg
                })

            }else{
                //No hay imagen
                var reg = await Descuento.findByIdAndUpdate({_id:id},{
                    titulo: data.titulo,
                    descuento: data.descuento, // Porcentaje o precio fijo
                    fecha_inicio: data.fecha_inicio, 
                    fecha_fin: data.fecha_fin
                });

                res.status(200).send({
                    data: reg
                })
            } 
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

const eliminar_descuento_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            // obtener id
            var id = req.params['id'];
            let prod = await Descuento.findById({_id:id});
            let reg = await Descuento.findByIdAndDelete({_id:id});

            // Eliminar portada anterior
            fs.stat('./uploads/descuentos/'+prod.banner, function(err){
                if(!err){
                    fs.unlink('./uploads/descuentos/'+prod.banner, (err)=>{
                        if (err) throw err;
                    });
                }
            });

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

const obtener_descuento_activo = async function(req, res){
    let descuentos = await Descuento.find().sort({createAd: -1});
    
    var arr_descuentos = [];
    var today = Date.parse(new Date().toString())/100;

    descuentos.forEach(element => {
        var tt_inicio = Date.parse(element.fecha_inicio+"T00:00:00")/100;
        var tt_fin = Date.parse(element.fecha_fin+"T23:59:59")/100;

        if(today >= tt_inicio && today <= tt_fin){
            arr_descuentos.push(element);
        }
    });

    if(arr_descuentos.length >= 1){
        res.status(200).send({
            data: arr_descuentos
        })
    }else{
        res.status(200).send({
            data: undefined
        })
    }

}

module.exports = {
    registro_descuento_admin,
    listar_descuentos_admin,
    obtener_banner,
    obtener_descuento_admin,
    actualizar_descuento_admin,
    eliminar_descuento_admin,
    obtener_descuento_activo
}



