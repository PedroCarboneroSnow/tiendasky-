import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';
import { io } from "socket.io-client";
import { GuestService } from 'src/app/services/guest.service';

declare var $:any; 
declare var iziToast:any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public token:any;
  public id: any;
  public user: any = undefined;
  public config_global:any={};
  public user_lc:any = undefined;
  public carrito_arr: Array<any> = [];
  public op_cart:any = false;
  public url:any;
  public subtotal = 0;
  public num_carrito = 0;
  public socket = io('http://localhost:4201');
  public descuento_activo: any;

  constructor(
    private _clienteService : ClienteService,
    private _router:Router,
    private elementRef: ElementRef,
    private _guestService: GuestService
  ) { 
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');
    this.url = GLOBAL.url;
    this.listar_categoria();

    if(this.token){
      this._clienteService.obtener_cliente_guest(this.id, this.token).subscribe(
        response =>{
          this.user = response.data;
          localStorage.setItem('user_data', JSON.stringify(this.user));
          if(localStorage.getItem('user_data')){
            this.user_lc = localStorage.getItem('user_data');
            this.user_lc = JSON.parse(this.user_lc);

            this.obtener_carrito_cliente();

          }else{
            this.user_lc = undefined;
          }
        }, error =>{
          console.log(error)
          this.user_lc = undefined;
        }
      );
    }
    
  }

  ngOnInit(): void {

    $('.navbar-sticky').removeClass('navbar-stuck');

    $(window).scroll(() => {
      const btnScrollTop = $('.btn-scroll-top.show');
      const navbarSticky = $('.navbar-sticky');
      if (btnScrollTop.length) {
        const scrollTop = $(window).scrollTop();
  
        if (scrollTop > 0) {
          navbarSticky.addClass('navbar-stuck');
        } else {
          navbarSticky.removeClass('navbar-stuck');
        }
      }else{
        navbarSticky.removeClass('navbar-stuck');
      }
    });


    let self:any = this;

    //this.elementRef.nativeElement.ownerDocument.addEventListener('click', this.closeModal.bind(this));
    this.socket.on('new-carrito', function(data:any){
      console.log(data);
      self.obtener_carrito_cliente();
    }.bind(this));

    this.socket.on('new-carrito-add', function(data:any){
      console.log(data);
      self.obtener_carrito_cliente();
    }.bind(this));

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

  logout(){
    window.location.reload();
    localStorage.clear();
    this._router.navigate(['/']);
  }

  obtener_carrito_cliente(){
    this._clienteService.obtener_carrito_cliente(this.user_lc._id, this.token).subscribe(
      response =>{
        this.carrito_arr = response.data;
        this.calcular_carrito();
      }
    );
  }

  listar_categoria(){
    this._clienteService.obtener_categorias_public().subscribe(
      response =>{
        this.config_global = response.data;
      }, error =>{
        console.log(error)
      }
    );
  }
  
  closeModal(event:any) {
    // Verificar si el clic ocurrió fuera del modal
    if (!this.elementRef.nativeElement.contains(event.target)) {
      // Cerrar el modal
      this.op_modalcart();
    }
  }

  op_modalcart(){
    if(this.op_cart == false){
      this.op_cart = true;
      $('#cart').addClass('show')
    }else{
      this.op_cart = false;
      $('#cart').removeClass('show')
    }
  }

  calcular_carrito(){
    this.subtotal = 0;
    this.carrito_arr.forEach(element => {
      this.subtotal = this.subtotal + parseInt(element.precio) * element.cantidad;
    
    })

    this.num_carrito = this.carrito_arr.length;
  } 

  eliminar_item(id:any){
    this._clienteService.eliminar_carrito_cliente(id, this.token).subscribe(
      response=>{
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
          onClose: function() {
            // console.info('onClose');
          },
        });
       this.socket.emit('delete-carrito', {data: response.data});

       this.obtener_carrito_cliente();
      }
    );
  }

}
