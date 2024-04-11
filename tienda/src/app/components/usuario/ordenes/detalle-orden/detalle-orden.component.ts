import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StarRatingComponent } from 'ng-starrating';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast:any;
declare var $:any;


@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.css']
})
export class DetalleOrdenComponent implements OnInit {

  public total_star:any = 5;
  public estar:any;

  public url:any;
  public token:any;
  public load_data = true;
  public orden :any = {};
  public detalles : Array<any> = [];
  public id:any;
  public review:any = {};

  constructor(
    private _clienteService: ClienteService,
    private _activatedRoute: ActivatedRoute
  ) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._activatedRoute.params.subscribe(
      params =>{
        this.id = params['id'];
        this.init_data();
        
      }
    );
  }

  ngOnInit(): void {
  }

  init_data(){
    this._clienteService.obtener_detalle_ordene_cliente(this.id, this.token).subscribe(
      response =>{
        if(response.data != undefined){
          this.orden = response.data;
          response.detalles.forEach((element:any) => {
            this._clienteService.obtener_review_producto_cliente(element.producto._id).subscribe(
              response =>{
                let emitido = false;
                let estrellas = 0;
                response.data.forEach((element_:any) => {
                  if(element_.cliente == localStorage.getItem('_id')){
                    emitido = true;
                  }

                  estrellas = element_.estrellas;
                });
                element.estado = emitido;
                element.estrella = estrellas;
              }
            );
          });
          this.detalles = response.detalles;
          this.load_data = false;
        }else{
          this.orden = undefined;
        }
      }
    );
  }

  openModal(item:any){
    this.review = {};
    this.review.producto = item.producto._id;
    this.review.cliente  = item.cliente;
    this.review.venta = this.id;
    this.total_star = 5;
  }

  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}) {
    this.total_star = $event.newValue;
  }

  emitir(id:any){
    if (this.review.review){
      if (this.total_star && this.total_star >= 0){
        console.log(this.estar)
        this.review.estrellas = this.total_star;
        this._clienteService.emitir_review_producto_cliente(this.review, this.token).subscribe(
          response =>{

            iziToast.show({
              id: 'toast-success',
              //theme: 'light',
              titleSize: 18,
              titleLineHeight: 20,
              messageSize: 14,
              messageLineHeight: 20,
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png ',
              titleColor: '#02AC26',
              title: 'Existoso!',
              message: 'Se emitio correctamente la reseña.',
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

            console.log(response)
            $('#review-' + id).modal('hide');
            $('.modal-backdrop').removeClass('show');
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');

            this.init_data();
          }
        );
      }else{
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
          message: 'Seleccione el numero de estrellas.',
          class: 'text-danger',
          position: 'topCenter',
          transitionIn: 'flipInX',
          transitionOut: 'flipOutX',
          progressBarColor: 'rgb(255, 0, 0)',
          layout: 2,
          timeout: 1500
        });
      }
    }else{
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
        message: 'Ingrese una reseña.',
        class: 'text-danger',
        position: 'topCenter',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        progressBarColor: 'rgb(255, 0, 0)',
        layout: 2,
        timeout: 1500
      });
    }
  }
}
