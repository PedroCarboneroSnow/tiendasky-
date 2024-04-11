import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';
import { io } from "socket.io-client";
import { GuestService } from 'src/app/services/guest.service';

declare var noUiSlider: any;
declare var jQuery: any;
declare var $: any;
declare var iziToast: any;


@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  public token: any;
  public config_global: any = {};
  public filter_categoria: any = '';

  public page = 1;
  public pageSize = 12;
  public sort_by = 'Defecto';

  public productos: Array<any> = [];
  public descuento_activo: any;
  public filter_producto: any = '';
  public url: any;
  public filter_cat_productos = 'todos';
  public route_categoria: any;
  public load_data = true;
  public socket = io('http://localhost:4201');

  public count_five_start = 0;
  public count_four_start = 0;
  public count_three_start = 0;
  public count_two_start = 0;
  public count_one_start = 0;

  public total_puntos = 0;
  public max_puntos = 0;
  public porcent_raiting = 0;
  public puntos_raiting = 0;

  public cinco_porcent = 0;
  public cuatro_porcent = 0;
  public tres_porcent = 0;
  public dos_porcent = 0;
  public uno_porcent = 0;

  public btn_cart = false;

  dias: number;
  horas: number;
  minutos: number;
  segundos: number;


  public carrito_data: any = {
    variedad: '',
    cantidad: 1
  };

  constructor(
    private _clienteService: ClienteService,
    private _route: ActivatedRoute,
    private _guestService: GuestService
  ) {
    this.dias = 0;
    this.horas = 0;
    this.minutos = 0;
    this.segundos = 0;

    this.url = GLOBAL.url;
    this.listar_categoria();
    this.token = localStorage.getItem('token')
    this._route.params.subscribe(
      params => {
        this.route_categoria = params['categoria']
        if (this.route_categoria) {
          this._clienteService.listar_producto_public('').subscribe(
            response => {
              this.productos = response.data;
              let iddprod = response.data._id;

              console.log(iddprod)
        
              this.productos = this.productos.filter(item => item.categoria.toLowerCase() == this.route_categoria);
              this.load_data = false;

            }, error => {
              console.log(error)
            }
          );
        } else {
          this.listar_productos();
        }
      }
    )
  }

  ngOnInit(): void {
    
    this.iniciarCuentaRegresiva();
    
    var slider: any = document.getElementById('slider');
    
    noUiSlider.create(slider, {
      start: [0, 3000],
      connect: true,
      range: {
        'min': 0,
        'max': 3000
      },
      tooltips: [true, true],
      pips: {
        mode: 'count',
        values: 5,

      }
    })

    slider.noUiSlider.on('update', function (values: any) {
      $('.cs-range-slider-value-min').val(values[0]);
      $('.cs-range-slider-value-max').val(values[1]);
    });
    $('.noUi-tooltip').css('font-size', '11px');

    this._guestService.obtener_descuento_activo().subscribe(
      response =>{
        if(response.data != undefined){
          this.descuento_activo = response.data[0];
          
        }else{
          this.descuento_activo = undefined;
        }
        
      }
    );

    
    
  }


  iniciarCuentaRegresiva() {
    this._guestService.obtener_descuento_activo().subscribe(
      response =>{
        if(response.data != undefined){
          this.descuento_activo = response.data[0];

          console.log(this.descuento_activo)
          var ffin:string= this.descuento_activo.fecha_fin + " 11:59:59 PM";
          var fechaLimite = new Date(ffin);
          console.log(ffin)

          setInterval(() => {
            var fechaActual = new Date();
            var diferenciaTiempo = fechaLimite.getTime() - fechaActual.getTime();

            if (diferenciaTiempo > 0) {
              this.dias = Math.floor(diferenciaTiempo / (24 * 60 * 60 * 1000));
              this.horas = Math.floor((diferenciaTiempo % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
              this.minutos = Math.floor((diferenciaTiempo % (60 * 60 * 1000)) / (60 * 1000));
              this.segundos = Math.floor((diferenciaTiempo % (60 * 1000)) / 1000);
            } else {
              // La oferta ha expirado, realiza alguna acción aquí si es necesario
            }
          }, 1000);
        }else{
          this.descuento_activo = undefined;
        }
        
      }
    );  
    

  }


  listar_categoria() {
    this._clienteService.obtener_categorias_public().subscribe(
      response => {
        this.config_global = response.data;
      }, error => {
        console.log(error)
      }
    );
  }

  listar_productos() {
    this._clienteService.listar_producto_public('').subscribe(
      response => {
        this.productos = response.data;
        this.productos.forEach((element:any) => {
          let idprod = element._id;
          
        });
        this.load_data = false;
        
      }, error => {
        console.log(error)
      }
    );
  }

  buscar_categoria() {
    if (this.filter_categoria) {
      const search = new RegExp(this.filter_categoria, 'i');
      this.config_global.categorias = this.config_global.categorias.filter(
        (item: any) => search.test(item.titulo)
      );
    } else {
      this.listar_categoria();
    }
  }

  buscar_producto() {
    this._clienteService.listar_producto_public(this.filter_producto).subscribe(
      response => {
        this.productos = response.data;
        this.load_data = false;
      }, error => {
        console.log(error)
      }
    );
  }

  buscar_producto2(e: any) {
    if (this.filter_producto) {
      var keycode = (e.keyCode ? e.keyCode : e.which);
      if (keycode == '13') {
        this._clienteService.listar_producto_public(this.filter_producto).subscribe(
          response => {
            this.productos = response.data;
            this.load_data = false;
          }, error => {
            console.log(error)
          }
        );
      }
    } else {
      this.listar_productos();
    }


  }

  buscar_producto3() {
    if (this.filter_producto) {

    } else {
      this.listar_productos();
    }
  }

  buscar_precios() {

    this._clienteService.listar_producto_public(this.filter_producto).subscribe(
      response => {
        this.productos = response.data;
        var min: any = parseInt($('.cs-range-slider-value-min').val());
        var max: any = parseInt($('.cs-range-slider-value-max').val());

        this.productos = this.productos.filter((item: any) => {
          return item.precio >= min && item.precio <= max;
        });
      }, error => {
        console.log(error)
      }
    )
  }

  buscar_por_categoria() {
    this._clienteService.listar_producto_public(this.filter_producto).subscribe(
      response => {
        this.productos = response.data;
        if (this.filter_cat_productos == 'todos') {
          this.listar_productos();
        } else {
          this.productos = this.productos.filter(item => item.categoria == this.filter_cat_productos);
        }
      }, error => {
        console.log(error)
      }
    )

  }

  reset_productos() {
    window.location.href = '/productos';

    this.filter_producto = '';
    this.listar_productos();
  }

  orden_por() {
    if (this.sort_by == 'Defecto') {
      this.listar_productos();
    } else if (this.sort_by == 'Popularidad') {
      this.productos.sort(function (a, b) {
        if (a.nventas < b.nventas) {
          return 1;
        }

        if (a.nventas > b.nventas) {
          return -1;
        }

        return 0;
      });
    } else if (this.sort_by == 'mas_menos_precio') {
      this.productos.sort(function (a, b) {
        if (a.precio < b.precio) {
          return 1;
        }

        if (a.precio > b.precio) {
          return -1;
        }

        return 0;
      });
    } else if (this.sort_by == 'menos_mas_precio') {
      this.productos.sort(function (a, b) {
        if (a.precio > b.precio) {
          return 1;
        }

        if (a.precio < b.precio) {
          return -1;
        }

        return 0;
      });
    } else if (this.sort_by == 'a_z') {
      this.productos.sort(function (a, b) {
        if (a.titulo.toLowerCase() > b.titulo.toLowerCase()) {
          return 1;
        }

        if (a.titulo.toLowerCase() < b.titulo.toLowerCase()) {
          return -1;
        }

        return 0;
      });
    } else if (this.sort_by == 'z_a') {
      this.productos.sort(function (a, b) {
        if (a.titulo.toLowerCase() < b.titulo.toLowerCase()) {
          return 1;
        }

        if (a.titulo.toLowerCase() > b.titulo.toLowerCase()) {
          return -1;
        }

        return 0;
      });
    }
  }


  agregar_producto(producto:any = []) {
    let data:any;
        

    if (this.descuento_activo != undefined) {
      data = {
        producto: producto._id,
        cliente:  localStorage.getItem('_id'),
        cantidad: this.carrito_data.cantidad,
        variedad: producto.variedades?.[0]?.titulo,
        precio:   Math.round(producto.precio - (producto.precio * this.descuento_activo.descuento) / 100)
      }

    } else {
      data = {
        producto: producto._id,
        cliente:  localStorage.getItem('_id'),
        cantidad: this.carrito_data.cantidad,
        variedad: producto.variedades?.[0]?.titulo,
        precio:   producto.precio
      }
    }


    this.btn_cart = true;
    this._clienteService.agregar_carrito_cliente(data, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          iziToast.show({
            id: 'toast-failed',
            titleSize: 18,
            titleLineHeight: 20,
            messageSize: 14,
            messageLineHeight: 20,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/9068/9068699.png",
            titleColor: '#FF0000',
            color: '#FFFBFB',
            title: 'Error',
            message: 'El producto ya se agrego al carrito',
            class: 'text-danger',
            position: 'topCenter',
            transitionIn: 'flipInX',
            transitionOut: 'flipOutX',
            progressBarColor: 'rgb(255, 0, 0)',
            layout: 2,
            timeout: 1500
          });
          this.btn_cart = false;
          
        } else{
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
            message: 'Se agrego el producto al carrito.',
            position: 'topCenter',
            transitionIn: 'flipInX',
            transitionOut: 'flipOutX',
            progressBarColor: '#02A324',
            color: '#FAFFFB',
            layout: 2,
            timeout: 1500,
            onClose: function() {
              // console.info('onClose');
            },
          });

          this.socket.emit('add-carrito-add', {data: true})
        }
        this.btn_cart = false;
      }, error=>{
        console.log(error)
      }
    )
  }
}
