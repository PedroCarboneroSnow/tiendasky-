'use strict'

var Cliente = require('../models/cliente');
var Direccion = require('../models/direccion');
var Contacto = require('../models/contacto');
var Venta = require('../models/venta');
var Dventa = require('../models/dventa');
var Review = require('../models/review');


var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt')

const util = require('util');
const bcryptCompare = util.promisify(bcrypt.compare);

//CLIENTE

const registro_cliente = async function (req, res) {
    var data = req.body;
    var clientes_arr = [];

    // Validar correo
    clientes_arr = await Cliente.find({ email: data.email });

    if (clientes_arr.length == 0) {
        if (data.password) {
            bcrypt.hash(data.password, null, null, async function (err, hash) {
                if (hash) {
                    // Registro con metodo create
                    data.password = hash;

                    var reg = await Cliente.create(data);

                    res.status(200).send({
                        data: reg
                    })
                } else {
                    res.status(200).send({
                        message: 'Error server, no se encripto.',
                        data: undefined
                    })
                }
            });
        } else {
            res.status(200).send({
                message: 'No hay una contraseña.',
                data: undefined
            })
        }
    } else {
        res.status(200).send({
            message: 'Correo ya existe en la base de datos.',
            data: undefined
        })
    }
}

const login_cliente = async function (req, res) {
    var data = req.body;
    var cliente_arr = [];

    cliente_arr = await Cliente.find({ email: data.email });

    if (cliente_arr.length == 0) {
        res.status(200).send({
            message: 'El correo no se encuentra registrado.',
            data: undefined
        })
    } else {
        // Login correcto
        let user = cliente_arr[0];
        bcrypt.compare(data.password, user.password, async function (error, result) {
            if (result) {
                res.status(200).send({
                    data: user,
                    token: jwt.createToken(user)
                });
            } else {
                res.status(200).send({
                    message: 'La contraseña no coincide.',
                    data: undefined
                });
            }
        });
    }
}

const registro_y_login_cliente = async (req, res) => {
    var data = req.body;
    var clientes_arr = [];

    // Validar correo
    clientes_arr = await Cliente.find({ email: data.email });

    if (clientes_arr.length == 0) {
        if (data.password) {
            bcrypt.hash(data.password, null, null, async function (err, hash) {
                if (hash) {
                    // Registro con método create
                    data.password = hash;

                    var reg = await Cliente.create(data);

                    console.log(data.password)
                    console.log(reg.password)

                    
                    // Login después del registro
                    try {
                        const passwordMatch = await bcryptCompare(data.password, reg.password);
                        if (passwordMatch) {
                            res.status(200).send({
                                message: 'Error al realizar el login después del registro.',
                                data: undefined
                            });
                        } else {
                        

                        res.status(200).send({
                            data: reg,
                            token: jwt.createToken(reg)
                        });
                        }
                    } catch (error) {
                        console.log('Error en la comparación de contraseñas:', error);
                        res.status(500).send({
                        message: 'Error en el servidor',
                        data: undefined
                        });
                    }
                } else {
                    res.status(200).send({
                        message: 'Error server, no se encriptó la contraseña.',
                        data: undefined
                    });
                }
            });
        } else {
            res.status(200).send({
                message: 'No hay una contraseña.',
                data: undefined
            });
        }
    } else {
        res.status(200).send({
            message: 'Correo ya existe en la base de datos.',
            data: undefined
        });
    }
}

const listar_cliente_filtro_admin = async (req, res) => {
    if (req.user) {
        if (req.user.role == 'admin') {
            let tipo = req.params['tipo'];
            let filtro = req.params['filtro'];

            if (tipo == null || tipo == 'null') {
                let reg = await Cliente.find();
                res.status(200).send({
                    data: reg
                })
            } else {
                // Filtro
                if (tipo == 'apellidos') {
                    let reg = await Cliente.find({ apellidos: new RegExp(filtro, 'i') });
                    res.status(200).send({
                        data: reg
                    })
                } else if (tipo == 'correo') {
                    let reg = await Cliente.find({ email: new RegExp(filtro, 'i') });
                    res.status(200).send({
                        data: reg
                    })
                }
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

const registro_cliente_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            var data = req.body;

            bcrypt.hash('12345', null, null, async function (err, hash) {
                if (hash) {
                    data.password = hash;
                    let reg = await Cliente.create(data);
                    res.status(200).send({
                        data: reg
                    })
                } else {
                    console.log(err)
                    res.status(200).send({
                        message: 'Error server, no se encripto.',
                        data: undefined
                    })
                }
            });
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

const obtener_cliente_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            // obtener id
            var id = req.params['id'];

            // Capturar el error
            try {
                var reg = await Cliente.findById({ _id: id });
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

const actualizar_cliente_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            // obtener id
            var id = req.params['id'];
            var data = req.body;

            var reg = await Cliente.findByIdAndUpdate({ _id: id }, {
                nombres: data.nombres,
                apellidos: data.apellidos,
                email: data.email,
                f_nacimiento: data.f_nacimiento,
                genero: data.genero,
                dni: data.dni,
                telefono: data.telefono
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

const eliminar_cliente_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            // obtener id
            var id = req.params['id'];
            let reg = await Cliente.findByIdAndDelete({ _id: id });

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

const obtener_cliente_guest = async function (req, res) {
    if (req.user) {
        // obtener id
        var id = req.params['id'];

        // Capturar el error
        try {
            var reg = await Cliente.findById({ _id: id });
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
}

const actualizar_cliente_guest = async function (req, res) {
    if (req.user) {
        // obtener id
        var id = req.params['id'];

        // Capturar el error
        var data = req.body;


        if (data.password) {
            console.log('Hay contraseña')
            bcrypt.hash(data.password, null, null, async function (err, hash) {
                let reg = await Cliente.findByIdAndUpdate({ _id: id }, {
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    telefono: data.telefono,
                    dni: data.dni,
                    f_nacimiento: data.f_nacimiento,
                    genero: data.genero,
                    pais: data.pais,
                    password: hash,
                });
                res.status(200).send({
                    data: reg
                })
            });


        } else {
            console.log('sin contraseña')
            let reg = await Cliente.findByIdAndUpdate({ _id: id }, {
                nombres: data.nombres,
                apellidos: data.apellidos,
                telefono: data.telefono,
                dni: data.dni,
                f_nacimiento: data.f_nacimiento,
                genero: data.genero,
                pais: data.pais,
            });

            res.status(200).send({
                data: reg
            })
        }
    } else {
        res.status(500).send({
            message: 'NoAccess'
        })
    }
}

// ORDENES

const obtener_ordenes_cliente = async function (req, res) {
    if (req.user) {
        var id = req.params['id'];

        let reg = await Venta.find({ cliente: id }).sort({ createAt: -1 });

        if (reg.length >= 1) {
            res.status(200).send({
                data: reg
            })
        } else {
            res.status(200).send({
                data: undefined
            })
        }


    } else {
        res.status(500).send({
            message: 'NoAccess'
        })
    }
}

const obtener_detalle_ordene_cliente = async function (req, res) {
    if (req.user) {
        var id = req.params['id'];
        

        try {
            let venta = await Venta.findById({ _id: id }).populate('direccion').populate('cliente');
            let detalles =  await Dventa.find({venta: id}).populate('producto');

            res.status(200).send({
                data: venta,
                detalles: detalles
            });
        
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
}

/// DIRECCIONES

const registro_direccion_cliente = async function (req, res) {
    if (req.user) {
        var data = req.body;

        if (data.principal) {
            let dir_cliente = await Direccion.find({ cliente: data.cliente });
            dir_cliente.forEach(async element => {
                await Direccion.findByIdAndUpdate({ _id: element._id }, { principal: false })
            })
        }

        let reg = await Direccion.create(data);

        res.status(200).send({
            data: reg,
        })
    } else {
        res.status(500).send({
            message: 'NoAccess'
        })
    }
}

const cambiar_direccion_cliente_principal = async function (req, res) {
    if (req.user) {
        var id = req.params['id'];
        var cliente = req.params['cliente'];

        let dir_cliente = await Direccion.find({ cliente: cliente });

        dir_cliente.forEach(async element => {
            await Direccion.findByIdAndUpdate({ _id: element._id }, { principal: false });
        });

        await Direccion.findByIdAndUpdate({ _id: id }, { principal: true });

        res.status(200).send({
            data: true,
        })

    } else {
        res.status(500).send({
            message: 'NoAccess'
        })
    }
}

const obtener_direccion_cliente = async function (req, res) {
    if (req.user) {
        var id = req.params['id'];

        let direcciones = await Direccion.find({ cliente: id }).populate('cliente').sort({ createAt: -1 });


        res.status(200).send({
            data: direcciones,
        })
    } else {
        res.status(500).send({
            message: 'NoAccess'
        })
    }
}

const obtener_direccion_principal_cliente = async function (req, res) {
    if (req.user) {
        var id = req.params['id'];

        var direccion = undefined;

        direccion = await Direccion.findOne({ cliente: id, principal: true }).populate('cliente').sort({ createAt: -1 });

        if (direccion == undefined) {
            res.status(200).send({
                data: undefined,
            })

        } else {
            res.status(200).send({
                data: direccion,
            })
        }



    } else {
        res.status(500).send({
            message: 'NoAccess'
        })
    }
}


// CONTACTO

const enviar_mensaje_contacto = async function (req, res) {
    let data = req.body;
    data.estado = "Abierto";

    let reg = await Contacto.create(data);


    res.status(200).send({
        data: reg,
    })

}

const obtener_mensajes_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let reg = await Contacto.find().sort({ createAt: -1 });

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

const cerrar_mensajes_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let id = req.params['id'];
            let reg = await Contacto.findByIdAndUpdate({ _id: id }, { estado: 'Cerrado' });
            console.log('LLega aqui')
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

// RESEÑA
const emitir_review_producto_cliente = async function (req, res) {
    if (req.user) {
        let data = req.body;
        let reg = await Review.create(data);

        res.status(200).send({
            data: reg
        })
    } else {
        res.status(500).send({
            message: 'NoAccess'
        })
    }
}

const obtener_review_producto_cliente = async function (req, res) {
    var id = req.params['id'];

    let reg = await Review.find({producto: id}).sort({createAt: -1});

    res.status(200).send({
        data: reg
    })
}


module.exports = {
    registro_cliente,
    login_cliente,
    listar_cliente_filtro_admin,
    registro_cliente_admin,
    obtener_cliente_admin,
    actualizar_cliente_admin,
    eliminar_cliente_admin,
    obtener_cliente_guest,
    actualizar_cliente_guest,
    registro_direccion_cliente,
    obtener_direccion_cliente,
    cambiar_direccion_cliente_principal,
    obtener_direccion_principal_cliente,
    enviar_mensaje_contacto,
    obtener_mensajes_admin,
    cerrar_mensajes_admin,
    obtener_ordenes_cliente,
    obtener_detalle_ordene_cliente,
    emitir_review_producto_cliente,
    obtener_review_producto_cliente,
    registro_y_login_cliente
}



