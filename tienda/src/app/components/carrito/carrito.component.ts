import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';
import { io } from "socket.io-client";
import { GuestService } from 'src/app/services/guest.service';
import { Router } from '@angular/router';

declare var iziToast: any;
declare var Cleave: any;
declare var StickySidebar: any;
declare var paypal: any;
declare var $: any;

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  @ViewChild('paypalButton', { static: true }) paypalElement!: ElementRef<any>;

  public id: any;
  public token: any;
  public carrito_arr: Array<any> = [];
  public envios: Array<any> = [];
  public op_cart: any = false;
  public direccion_principal: any = {};
  public card_data: any = {};
  public url: any;
  public subtotal = 0;
  public num_carrito = 0;
  public total = 0;
  public socket = io('http://localhost:4201');
  public precio_envio = "0";
  public btn_load = false;
  public carrito_load = true;
  public venta: any = {};
  public d_venta: Array<any> = [];
  public user: any = {};
  public error_cupon = '';
  public descuento = 0;
  public cuponValidado = false;
  public descuento_activo: any;
  public igv:any;
  public checked_bol = false;
  public checked_fact = false;

  constructor(
    private _clienteService: ClienteService,
    private _guestService: GuestService,
    private _router: Router
  ) {

    this.id = localStorage.getItem('_id');

    this.user = localStorage.getItem('user_data');
    this.user = JSON.parse(this.user)
    this.venta.cliente = this.id;

    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;

    this._guestService.get_envios().subscribe(
      response => {
        this.envios = response;
      }
    );


    console.log(this.user)
  }

  ngOnInit(): void {
    this._guestService.obtener_descuento_activo().subscribe(
      response =>{
        if(response.data != undefined){
          this.descuento_activo = response.data[0];
        }else{
          this.descuento_activo = undefined;
        }
        
      }
    );
    this.init_data();
    this.obtener_direccion_principal();
    setTimeout(() => {
      new Cleave('#cc-number', {
        creditCard: true,
        onCreditCardTypeChanged: function (type: any) {
          // update UI ...
        }
      });

      new Cleave('#cc-exp-date', {
        date: true,
        datePattern: ['m', 'y']
      });

      var sidebar = new StickySidebar('.sidebar-sticky', { topSpacing: 20 });
    },);



    paypal.Buttons({
      style: {
        layout: 'horizontal'
      },
      createOrder: (data: any, actions: any) => {
        var dolar_pago = this.total / 3.69;

        return actions.order.create({
          purchase_units: [{
            description: 'Pago en Sky+',
            amount: {
              currency_code: 'USD',
              value: dolar_pago.toFixed(2)
            },
          }]
        });

      },
      onApprove: async (data: any, actions: any) => {
        const order = await actions.order.capture();
        this.venta.transaccion = order.purchase_units[0].payments.captures[0].id;
        this.venta.detalles = this.d_venta;

        this._clienteService.registro_compra_cliente(this.venta, this.token).subscribe(
          response => {
            var id_venta = response.venta._id;
            console.log(response)
            this._clienteService.enviar_correo_compra_cliente(response.venta._id, this.token).subscribe(
              response=>{
                this.btn_load = false;
                this._router.navigate(['/cuenta/ordenes/'+id_venta])
              }
            );
          }
        );
      },
      onError: (err: any) => {

      },
      onCancel: function (data: any, actions: any) {

      }
    }).render(this.paypalElement.nativeElement);

    
  }

  click_checked_bol(){
    console.log(this.checked_bol)
    if(this.checked_bol == false){
      this.checked_bol = true;
    }else{
      this.checked_bol = false;
    }
    
  }

  init_data() {
    this._clienteService.obtener_carrito_cliente(this.id, this.token).subscribe(
      response => {
        this.carrito_arr = response.data;

        this.carrito_arr.forEach(element => {
          this.d_venta.push({
            producto: element.producto._id,
            subtotal: element.precio * element.cantidad,
            cantidad: element.cantidad,
            variedad: element.variedad,
            precio: element.precio,
            cliente: localStorage.getItem('_id')
          });
        });

        this.carrito_load = false;

        this.calcular_carrito();
        this.calcular_total('Envio Gratis');

      }
    );
  }

  get_token_culqi() {

    // Obtener los valores de los inputs
    var cardNumber = $('#cc-number').val();
    var expDate = $('#cc-exp-date').val();
    var cvc = $('#cc-cvc').val();

    $('#cc-number').removeClass('error');
    $('#cc-exp-date').removeClass('error');
    $('#cc-cvc').removeClass('error');

    console.log(cardNumber)
    // Validar si los inputs están vacíos
    if (cardNumber== '') {
      $('#cc-number').addClass('error');
    }
    else if (expDate == '') {
      $('#cc-exp-date').addClass('error');
    }
    else if (cvc == '') {
      $('#cc-cvc').addClass('error');
    } else {
      $('#cc-number').removeClass('error');
      $('#cc-exp-date').removeClass('error');
      $('#cc-cvc').removeClass('error');
      let month;
      let year;
      console.log('Llega awui')
      let exp_data = this.card_data.exp.toString().split('/')

      let data = {
        "card_number": this.card_data.ncard.toString().replace(/ /g, "").substr(0, 16),
        "cvv": this.card_data.cvc,
        "expiration_month": exp_data[0],
        "expiration_year": "20" + exp_data[1].substr(0, 2),
        "email": this.user.email,
        "metadata": {
          "dni": this.user.dni
        }
      }
      this.btn_load = true;

      this._clienteService.get_token_culqi(data).subscribe(
        response => {
          let charge = {
            "amount": this.subtotal + '00',
            "currency_code": "PEN",
            "email": this.user.email,
            "source_id": response.id
          }

          this._clienteService.get_charge_culqi(charge).subscribe(
            response => {

              this.venta.transaccion = response.id;
              this.venta.detalles = this.d_venta;

              this._clienteService.registro_compra_cliente(this.venta, this.token).subscribe(
                response => {
                  this._clienteService.enviar_correo_compra_cliente(response.venta._id, this.token).subscribe(
                    response=>{
                      this.btn_load = false;
                      this._router.navigate(['/'])
                    }
                  );
                }
              );

            }
          );
        }
      );
    }


  }


  obtener_direccion_principal() {
    this._clienteService.obtener_direccion_principal_cliente(localStorage.getItem('_id'), this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this.direccion_principal = undefined;
        } else {
          this.direccion_principal = response.data;
          this.venta.direccion = this.direccion_principal._id;
        }
      }
    );
  }

  calcular_carrito() {
    this.subtotal = 0;
    this.carrito_arr.forEach(element => {
      this.subtotal = this.subtotal + parseInt(element.precio) * element.cantidad;
    
    })

    this.num_carrito = this.carrito_arr.length;
  }

  eliminar_item(id: any) {
    this._clienteService.eliminar_carrito_cliente(id, this.token).subscribe(
      response => {
        iziToast.show({
          id: 'toast-success',
          //theme: 'light',
          titleSize: 18,
          titleLineHeight: 20,
          messageSize: 14,
          messageLineHeight: 20,
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png ',
          titleColor: '#02AC26',
          title: '¡Existoso!',
          message: 'Se elimino correctamente el producto del carrito.',
          position: 'topCenter',
          transitionIn: 'flipInX',
          transitionOut: 'flipOutX',
          progressBarColor: '#02A324',
          color: '#FAFFFB',
          layout: 2,
          timeout: 1500,
          onClose: function () {
            // console.info('onClose');
          },
        });
        this.socket.emit('delete-carrito', { data: response.data });
        this.init_data();
      }
    );
  }

  calcular_total(envio_titulo: any) {
    this.total = this.subtotal + parseInt(this.precio_envio);
    this.venta.subtotal = this.total;
    this.venta.envio_precio = parseInt(this.precio_envio);
    this.venta.envio_titulo = envio_titulo;
    this.igv = Math.round(this.total*0.18)
  }

  validar_cupon(){
    if(this.venta.cupon.toString().length >= 10){
      this.error_cupon = '';
      if (!this.cuponValidado) { // Verificar si el cupón ya ha sido validado
        this._clienteService.validar_cupon_cliente(this.venta.cupon, this.token).subscribe(
          response => {
            if (response.data != undefined) {
              this.error_cupon = '';
              if (response.data.tipo == 'Valor fijo') {
                this.descuento = response.data.valor;
                this.total = this.total - this.descuento;
              } else if (response.data.tipo == 'Porcentaje') {
                this.descuento = parseFloat(((this.total * response.data.valor) / 100).toFixed(2));
                this.total = parseFloat((this.total - this.descuento).toFixed(2));
              }
              this.cuponValidado = true; // Marcar el cupón como validado
            } else {
              this.error_cupon = 'El cupón no se pudo canjear o ha expirado';
            }
          }
        );
      }
    } else{
      // no es valido
      this.error_cupon = 'El cupón no es válido';
    } 
  }

}
