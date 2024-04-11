import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { DescuentosService } from 'src/app/services/descuentos.service';


declare var iziToast:any;
declare var $:any; 
declare var iziToast:any;

@Component({
  selector: 'app-index-descuento',
  templateUrl: './index-descuento.component.html',
  styleUrls: ['./index-descuento.component.css']
})
export class IndexDescuentoComponent implements OnInit {

  public load_data = true;
  public load_btn = false;
  public filtro = '';
  public token: any;
  public descuentos: any[] = [];
  public arr_descuentos: any[] = [];
  public page = 1;
  public pageSize = 7;
  public url:any;


  constructor(
    private _descuentoService : DescuentosService
  ) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data(){
    this._descuentoService.listar_descuentos_admin(this.filtro, this.token).subscribe(
      response =>{
        this.descuentos = response.data;

        this.descuentos.forEach(element => {
          var tt_inicio = Date.parse(element.fecha_inicio+"T00:00:00")/1000;
          var tt_fin = Date.parse(element.fecha_fin+"T00:00:00")/1000;
          var today = Date.parse(new Date().toString())/1000;


          if(today >=  tt_inicio){
            element.estado = 'Expirado'
          }
          if(today <  tt_inicio){
            element.estado = 'Proximamente'
          }
          if(today >=  tt_inicio && today <= tt_fin){
            element.estado = 'En progreso'
          }
        });

        console.log(this.descuentos)
      
        this.load_data = false;
      }, error =>{
        console.log(error)
      }
    )
  }

  filtrar(){
    this.load_data = true;
    if (this.filtro){
      this._descuentoService.listar_descuentos_admin(this.filtro, this.token).subscribe(
        response =>{
          this.descuentos = response.data;
          this.load_data = false;
          
        }, error =>{
          console.log(error)
        }
      )
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
        message: 'Ingrese un filtro para buscar.',
        position: 'topCenter',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        progressBarColor: 'rgb(255, 0, 0)',
        layout: 2,
        timeout: 2000
      });
      this.load_data = false;
    }
  }

  resetear(){
    this.load_data = true;
    this.filtro = '';
    
    this.init_data();
    this.load_data = false;
  }

  eliminar(id:any){
    this.load_btn = true;
    this._descuentoService.eliminar_descuento_admin(id, this.token).subscribe(
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
          title: 'Existoso!',
          message: 'Se elimino existosamente el producto.',
          position: 'topCenter',
          transitionIn: 'flipInX',
          transitionOut: 'flipOutX',
          progressBarColor: 'rgb(0, 255, 0)',
          layout: 2,
          timeout: 2000,
          onClose: function() {
            // console.info('onClose');
          },
        });
        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');
        
        this.load_btn = false;
        this.load_data = false;
        this.init_data();

      }, error =>{
        iziToast.show({
          id: 'toast-failed',
          titleSize: 18,
          titleLineHeight: 20,
          messageSize: 14,
          messageLineHeight: 20,
          iconUrl: "https://cdn-icons-png.flaticon.com/512/753/753345.png ",
          color: '#FCC8C2',
          title: 'Error',
          message: 'Ocurrio un error en el servidor.',
          position: 'topCenter',
          transitionIn: 'flipInX',
          transitionOut: 'flipOutX',
          progressBarColor: 'rgb(255, 0, 0)',
          layout: 2,
          timeout: 2000
        });
        console.log(error)
        this.load_btn = false;
        this.load_data = false;
      }
    );
  }

}
