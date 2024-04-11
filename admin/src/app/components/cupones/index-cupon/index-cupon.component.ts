import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { CuponService } from 'src/app/services/cupon.service';

declare var jQuery:any;
declare var $:any; 
declare var iziToast:any;

@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css']
})
export class IndexCuponComponent implements OnInit {

  public cupones: Array<any> = [];
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
    this._cuponService.listar_cupon_admin(this.filtro, this.token).subscribe(
      response=>{
        this.cupones = response.data;
        this.load_data = false;
        // setTimeout(()=>{
          
        // }, 2000);
      },
      error =>{
        console.log(error)
      }
    );
  }


  eliminar(id:any){
    this._cuponService.eliminar_cupon_admin(id, this.token).subscribe(
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
          message: 'Se elimino existosamente el cupón.',
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
        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');

        this.init_data();
      }, error =>{
        console.log(error)
      }
    );
  }

  filtrar(){
    this.load_data = true;
    if (this.filtro){
      this._cuponService.listar_cupon_admin(this.filtro, this.token).subscribe(
        response =>{
          console.log(response.data)
          this.cupones = response.data;
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
}
