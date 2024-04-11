import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';


declare var iziToast: any;
declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-variedad-producto',
  templateUrl: './variedad-producto.component.html',
  styleUrls: ['./variedad-producto.component.css']
})
export class VariedadProductoComponent implements OnInit {
  public producto : any = {};
  public nombre_variedad:any;
  public id:any;
  public token:any;
  public nueva_variedad = '';
  public load_btn = false;
  public url:any;

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService,
    
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
   }

  ngOnInit(): void {
    this.init_data();
  }

  init_data(){
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
          response => {
            if(response.data == undefined){
              this.producto = undefined;
              console.log(this.producto)
            }else{
              this.producto = response.data;
              console.log(this.producto)
            }
            
          }, error => {
            console.log(error);
          }
        );
      }
    )
  }
  
  eliminar_variedad(idx:any){
    this.producto.variedades.splice(idx, 1)
  }

  agregar_variedad(){
    if (this.nueva_variedad){
      console.log(this.nueva_variedad)
      this.producto.variedades.push({
        titulo: this.nueva_variedad
      })

      this.nueva_variedad = '';
    }else{
      iziToast.show({
        id: 'toast-failed',
        titleSize: 18,
        titleLineHeight: 20,
        messageSize: 14,
        messageLineHeight: 20,
        iconUrl: "https://cdn-icons-png.flaticon.com/512/753/753345.png ",
        color: '#FCC8C2',
        title: 'Error',
        message: 'Debe ingresar un nombre de la variedad.',
        position: 'topCenter',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        progressBarColor: 'rgb(255, 0, 0)',
        layout: 2,
        timeout: 2000
      });
    }
  }
  
  actualizar(){
    if(this.producto.titulo_variedad){
      if(this.producto.variedades.length >= 1){
        this.load_btn = true;
        this._productoService.actualizar_producto_variedades_admin({titulo_variedad: this.producto.titulo_variedad, variedades: this.producto.variedades}, this.id, this.token).subscribe(
          response =>{
            iziToast.show({
              id: 'toast-success',
              //theme: 'light',
              titleSize: 18,
              titleLineHeight: 20,
              messageSize: 14,
              messageLineHeight: 20,
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png ',
              color: '#C4F7C6',
              title: 'Actualización existosa!',
              message: 'Se actualizo existosamente el producto.',
              position: 'topCenter',
              transitionIn: 'flipInX',
              transitionOut: 'flipOutX',
              progressBarColor: 'rgb(0, 255, 0)',
              layout: 2,
              timeout: 2000,
              onClose: function () {
                // console.info('onClose');
              },
            });
            this.load_btn = false;
          }, error =>{
            console.log(error)
          }
        );

      }else{
        iziToast.show({
          id: 'toast-failed',
          titleSize: 18,
          titleLineHeight: 20,
          messageSize: 14,
          messageLineHeight: 20,
          iconUrl: "https://cdn-icons-png.flaticon.com/512/753/753345.png ",
          color: '#FCC8C2',
          title: 'Error',
          message: 'Se debe agregar almenos una variedad de producto.',
          position: 'topCenter',
          transitionIn: 'flipInX',
          transitionOut: 'flipOutX',
          progressBarColor: 'rgb(255, 0, 0)',
          layout: 2,
          timeout: 2000
        });
      }
    }else{
      iziToast.show({
        id: 'toast-failed',
        titleSize: 18,
        titleLineHeight: 20,
        messageSize: 14,
        messageLineHeight: 20,
        iconUrl: "https://cdn-icons-png.flaticon.com/512/753/753345.png ",
        color: '#FCC8C2',
        title: 'Error',
        message: 'Debe completar el titulo de la variedad.',
        position: 'topCenter',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        progressBarColor: 'rgb(255, 0, 0)',
        layout: 2,
        timeout: 2000
      });
    }
  }
}
