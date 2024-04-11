'use strict'

var Producto = require('../models/producto');
var Review = require('../models/review');
var Inventario = require('../models/inventario');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt')
var fs = require('fs');
var path = require('path')


const registro_producto_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            var data = req.body;

            var img_path = req.files.portada.path;
            var name = img_path.split('\\');
            var portada_name = name[2];

            data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,'')
            data.portada = portada_name;
            let reg = await Producto.create(data);

            let inventario = await Inventario.create({
                admin: req.user.sub,
                cantidad: data.stock,
                proveedor: 'Proveedor 1',
                producto: reg._id
            })

            res.status(200).send({
                data: reg,
                inventario: inventario
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

const listar_productos_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            var filtro = req.params['filtro'];
            var reg;

            if (filtro) {
                reg = await Producto.find({titulo: new RegExp(filtro, 'i')}).sort({createAt: -1});
            } else {
                reg = await Producto.find().sort({createAt: -1});
            }

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

const obtener_producto_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            // obtener id
            var id = req.params['id'];

            // Capturar el error
            try {
                var reg = await Producto.findById({_id: id});
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

const obtener_portada = async function(req, res){
    var img = req.params['img'];
    // console.log(img)
    fs.stat('./uploads/productos/'+img, function(err){
        if (!err){
            let img_path = './uploads/productos/'+img;
            res.status(200).sendFile(path.resolve(img_path))
        }else{
            let img_path = './uploads/img_defecto.png';
            res.status(200).sendFile(path.resolve(img_path))
        }
    });
}

const actualizar_producto_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            let id = req.params['id'];

            var data = req.body;

            if(req.files){
                var data = req.body;
                var img_path = req.files.portada.path;
                var name = img_path.split('\\');
                var portada_name = name[2];
                data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,'')

                var reg = await Producto.findByIdAndUpdate({_id:id},{
                    titulo: data.titulo,
                    precio: data.precio,
                    stock: data.stock,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    contenido: data.contenido,
                    marca: data.marca,
                    portada: portada_name
                });
                // Eliminar portada anterior
                fs.stat('./uploads/productos/'+reg.portada, function(err){
                    if(!err){
                        fs.unlink('./uploads/productos/'+reg.portada, (err)=>{
                            if (err) throw err;
                        });
                    }
                });

                res.status(200).send({
                    data: reg
                })

            }else{
                //No hay imagen
                var reg = await Producto.findByIdAndUpdate({_id:id},{
                    titulo: data.titulo,
                    precio: data.precio,
                    stock: data.stock,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    marca: data.marca,
                    contenido: data.contenido
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

const eliminar_producto_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            // obtener id
            var id = req.params['id'];
            let prod = await Producto.findById({_id:id});
            let reg = await Producto.findByIdAndDelete({_id:id});

            // Eliminar portada anterior
            fs.stat('./uploads/productos/'+prod.portada, function(err){
                if(!err){
                    fs.unlink('./uploads/productos/'+prod.portada, (err)=>{
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

const listar_inventario_producto_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            var id = req.params['id'];
            var reg = await Inventario.find({producto: id}).populate('admin').sort({createAt: -1});

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

const eliminar_inventario_producto_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            
            // Obtener id del invetario
            var id = req.params['id'];
            var reg = await Inventario.findByIdAndRemove({_id: id});

            // Obtener resgistro de producto
            let numProd = await Producto.findById({_id: reg.producto});


            // Calcular el nuevo stock
            let nuevoStock = parseInt(numProd.stock) - parseInt(reg.cantidad);

            // Actualizacion del producto
            let prod = await Producto.findByIdAndUpdate({_id: reg.producto}, {
                stock: nuevoStock
            })

            res.status(200).send({
                data: prod
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

const registro_inventario_producto_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            
            let data = req.body;

            let  reg =  await Inventario.create(data);
            // Obtener resgistro de producto
            let prod = await Producto.findById({_id: reg.producto});

            // Calcular el nuevo stock
            let nuevoStock = parseInt(prod.stock) + parseInt(reg.cantidad);

            // Actualizacion del producto
            let actProd = await Producto.findByIdAndUpdate({_id: reg.producto}, {
                stock: nuevoStock
            })

            res.status(200).send({
                data: reg,
                data1: actProd
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

const actualizar_producto_variedades_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            let id = req.params['id'];

            var data = req.body;
            var reg = await Producto.findByIdAndUpdate({_id:id},{
                titulo_variedad: data.titulo_variedad,
                variedades: data.variedades
            });

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

const agregar_imagen_galeria_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            let id = req.params['id'];

            var data = req.body;
            
            var img_path = req.files.imagen.path;
            var name = img_path.split('\\');
            var imagen_name = name[2];

            let reg = await Producto.findByIdAndUpdate({_id: id}, {
                $push: {galeria:{
                    image: imagen_name,
                    _id: data._id
                }}
            });

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

const eliminar_imagen_galeria_admin = async function(req, res){
    if (req.user) {
        if (req.user.role == 'admin') {
            let id = req.params['id'];

            var data = req.body;
            let prod = await Producto.findOne({_id:id});

            let galeria = prod.galeria.find(obj => obj._id === data._id);
        
            let reg = await Producto.findByIdAndUpdate({ _id: id }, {
                $pull: {
                    galeria: {
                        _id: data._id
                    }
                }
            }
            );
            
            // Eliminar portada anterior
            fs.stat('./uploads/productos/'+galeria.image, function(err){
                if(!err){
                    fs.unlink('./uploads/productos/'+galeria.image, (err)=>{
                        if (err) throw err;
                    });
                }
            });

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


// Metodos publicos

const listar_producto_public = async function (req, res) {
    var filtro = req.params['filtro'];
    var reg;

    if (filtro) {
        reg = await Producto.find({ titulo: new RegExp(filtro, 'i') }).sort({createAt: -1});
    } else {
        reg = await Producto.find().sort({createAt: -1});
    }

    res.status(200).send({
        data: reg
    })
}

const obtener_producto_slug_public = async function (req, res) {
    var slug = req.params['slug'];
    let reg = await Producto.findOne({ slug: slug});

    res.status(200).send({
        data: reg
    })
}

const listar_producto_recomendados_public = async function (req, res) {
    var categoria = req.params['categoria'];
    let reg;

    reg = await Producto.find({ categoria: categoria }).sort({createAt: -1}).limit(8);

    res.status(200).send({
        data: reg
    })
}

const listar_producto_public_nuevos = async function (req, res) {
    var reg = await Producto.find().sort({createAt: -1}).limit(8);

    res.status(200).send({
        data: reg
    })
}

const listar_producto_public_masvendidos = async function (req, res) {
    var reg = await Producto.find().sort({nventas: -1}).limit(8);

    res.status(200).send({
        data: reg
    })
}


// Reviewss
const obtener_reviews_publico_producto = async function (req, res) {
    let id = req.params['id'];


    var rev = await Review.find({producto:id}).sort({nventas: -1}).populate('producto').populate('cliente');

    res.status(200).send({
        data: rev
    })
}

module.exports = {
    registro_producto_admin,
    obtener_producto_admin,
    listar_productos_admin,
    obtener_portada,
    actualizar_producto_admin,
    eliminar_producto_admin,
    eliminar_inventario_producto_admin,
    listar_inventario_producto_admin,
    registro_inventario_producto_admin,
    actualizar_producto_variedades_admin,
    agregar_imagen_galeria_admin,
    eliminar_imagen_galeria_admin,
    // metodos publicos
    listar_producto_public,
    obtener_producto_slug_public,
    listar_producto_recomendados_public,
    listar_producto_public_nuevos,
    listar_producto_public_masvendidos,
    obtener_reviews_publico_producto
}



