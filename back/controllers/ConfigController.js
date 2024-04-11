
var Config = require('../models/config');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt')
var fs = require('fs');
var path = require('path')

const obtener_config_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            let reg = await Config.findById({_id: "645ef3666cdd6c204c221cac"});

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

const actualizar_config_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            var data = req.body;
            if(req.files){
                console.log('si hay imagen')
                
                var img_path = req.files.logo.path;
                var name = img_path.split('\\');
                var logo_name = name[2];

                data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,'')

                let reg = await Config.findByIdAndUpdate({_id: "645ef3666cdd6c204c221cac"},{
                    categorias: JSON.parse(data.categorias),
                    titulo: data.titulo,
                    serie: data.serie,
                    correlativo: data.correlativo,
                    logo: logo_name
                });

                // Eliminar portada anterior
                fs.stat('./uploads/configuraciones/'+reg.logo, function(err){
                    if(!err){
                        fs.unlink('./uploads/configuraciones/'+reg.logo, (err)=>{
                            if (err) throw err;
                        });
                    }
                });

                res.status(200).send({
                    data: reg
                })

            }else{
                console.log('No hay imagen')
                //No hay imagen
                let reg = await Config.findByIdAndUpdate({_id: "645ef3666cdd6c204c221cac"},{
                    categorias: data.categorias,
                    titulo: data.titulo,
                    serie: data.serie,
                    correlativo: data.correlativo
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

const obtener_logo = async function(req, res){
    var img = req.params['img'];
    // console.log(img)
    fs.stat('./uploads/configuraciones/'+img, function(err){
        if (!err){
            let img_path = './uploads/configuraciones/'+img;
            res.status(200).sendFile(path.resolve(img_path))
        }else{
            console.log('')
            let img_path = './uploads/img_defecto.png';
            res.status(200).sendFile(path.resolve(img_path))
        }
    });
}

const obtener_categorias_public = async function (req, res) {
    let reg = await Config.findById({ _id: "645ef3666cdd6c204c221cac" });

    res.status(200).send({
        data: reg
    })
}

module.exports = {
    actualizar_config_admin,
    obtener_config_admin,
    obtener_logo,
    obtener_categorias_public
}
