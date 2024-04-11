import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { CuponService } from 'src/app/services/cupon.service';

declare var $:any; 
declare var iziToast:any;

@Component({
  selector: 'app-index-contacto',
  templateUrl: './index-contacto.component.html',
  styleUrls: ['./index-contacto.component.css']
})
export class IndexContactoComponent implements OnInit {

  public mensajes: Array<any> = [];
  public filtro = '';
  public page = 1;
  public pageSize = 10;
  public token:any;
  public load_data = true;

  constructor(
    private _cuponService:CuponService,
    private _adminService:AdminService
  ){
    this.token = this._adminService.getToken();
  }
  

  ngOnInit(): void {
    this.init_data();
  }

  init_data(){
    this._adminService.obtener_mensajes_admin(this.token).subscribe(
      response=>{
        this.mensajes = response.data;
        this.load_data = false;
        // setTimeout(()=>{
          
        // }, 2000);
      },
      error =>{
        console.log(error)
      }
    );
  }


  cerrar(id:any){
    this._adminService.cerrar_mensajes_admin(id, {data: undefined}, this.token).subscribe(
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
          message: 'Se cerró existosamente el mensaje.',
          position: 'topCenter',
          transitionIn: 'flipInX',
          transitionOut: 'flipOutX',
          progressBarColor: 'rgb(0, 255, 0)',
          layout: 2,
          timeout: 1500,
          onClose: function() {
            // console.info('onClose');
          },
        });
        $('#estadoModal-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');

        this.init_data();
      }, error =>{
        console.log(error)
      }
    );
  }
}
