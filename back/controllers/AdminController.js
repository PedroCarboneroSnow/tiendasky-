'use strict'

var Admin = require('../models/admin');
var Venta = require('../models/venta');
var Dventa = require('../models/dventa');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt')


const registro_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            var data = req.body;
            var admin_arr = [];

            // Validar correo
            admin_arr = await Admin.find({ email: data.email });

            if (admin_arr.length == 0) {
                if (data.password) {
                    bcrypt.hash(data.password, null, null, async function (err, hash) {
                        if (hash) {
                            // Registro con metodo create
                            data.password = hash;

                            var reg = await Admin.create(data);

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

const login_admin = async function (req, res) {
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.find({ email: data.email });

    if (admin_arr.length == 0) {
        res.status(200).send({
            message: 'No se encontro el correo',
            data: undefined
        })
    } else {
        // login correcto
        let user = admin_arr[0];

        bcrypt.compare(data.password, user.password, async function (error, check) {
            if (check) {
                res.status(200).send({
                    data: user,
                    token: jwt.createToken(user)
                });
            } else {
                res.status(200).send({
                    message: 'La contraseña no coincide',
                    data: undefined
                });
            }
        });
    }

}

// Ventas

const obtener_ventas_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let ventas = [];
            let desde = req.params['desde'];
            let hasta = req.params['hasta'];

            if (desde == 'undefined' && hasta == 'undefined') {
                ventas = await Venta.find().populate('cliente').populate('direccion').sort({ createAt: -1 });
                res.status(200).send({
                    data: ventas
                })
            } else {
                let tt_desde = Date.parse(new Date(desde + 'T00:00:00')) / 1000;
                let tt_hasta = Date.parse(new Date(hasta + 'T00:00:00')) / 1000;

                let tem_ventas = await Venta.find().populate('cliente').populate('direccion').sort({ createAt: -1 });

                for (var item of tem_ventas) {
                    var tt_created = Date.parse(new Date(item.createAt)) / 1000;
                    if (tt_created >= tt_desde && tt_created <= tt_hasta) {
                        ventas.push(item)
                    }
                }
                res.status(200).send({
                    data: ventas
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

// KPI DE LA TIENDA

const kpi_ganancias_mensuales_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            var enero = 0;
            var febrero = 0;
            var marzo = 0;
            var abril = 0;
            var mayo = 0;
            var junio = 0;
            var julio = 0;
            var agosto = 0;
            var septiembre = 0;
            var octubre = 0;
            var noviembre = 0;
            var diciembre = 0;

            var total_ganancia = 0;
            var total_mes = 0;
            var count_ventas = 0;
            var total_mes_anterior = 0;

            var reg = await Venta.find();

            let current_date = new Date();
            let current_year = current_date.getFullYear();
            let current_month = current_date.getMonth() + 1;

            for (var item of reg) {
                let createAt_date = new Date(item.createAt);
                let mes = createAt_date.getMonth() + 1;

                if (createAt_date.getFullYear() == current_year) {
                    total_ganancia = total_ganancia + item.subtotal;



                    if (mes == current_month) {
                        total_mes = total_mes + item.subtotal;
                        count_ventas = count_ventas + 1;
                    }

                    if (mes == current_month - 1) {
                        total_mes_anterior = total_mes_anterior + item.subtotal;
                    }

                    if (mes === 1) {
                        enero += item.subtotal;
                    } else if (mes === 2) {
                        febrero += item.subtotal;
                    } else if (mes === 3) {
                        marzo += item.subtotal;
                    } else if (mes === 4) {
                        abril += item.subtotal;
                    } else if (mes === 5) {
                        mayo += item.subtotal;
                    } else if (mes === 6) {
                        junio += item.subtotal;
                    } else if (mes === 7) {
                        julio += item.subtotal;
                    } else if (mes === 8) {
                        agosto += item.subtotal;
                    } else if (mes === 9) {
                        septiembre += item.subtotal;
                    } else if (mes === 10) {
                        octubre += item.subtotal;
                    } else if (mes === 11) {
                        noviembre += item.subtotal;
                    } else if (mes === 12) {
                        diciembre += item.subtotal;
                    }
                }

            }

            res.status(200).send({
                enero: enero,
                febrero: febrero,
                marzo: marzo,
                abril: abril,
                mayo: mayo,
                junio: junio,
                julio: julio,
                agosto: agosto,
                septiembre: septiembre,
                octubre: octubre,
                noviembre: noviembre,
                diciembre: diciembre,
                total_ganancia: total_ganancia,
                total_mes: total_mes,
                count_ventas: count_ventas,
                total_mes_anterior: total_mes_anterior
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



module.exports = {
    registro_admin,
    login_admin,
    obtener_ventas_admin,
    kpi_ganancias_mensuales_admin
}



