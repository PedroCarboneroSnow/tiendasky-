import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var jQuery:any;
declare var $:any; 
declare var iziToast:any;



@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrls: ['./index-cliente.component.css']
})

export class IndexClienteComponent implements OnInit {

  public clientes: Array<any> = [];
  public filtro_apellidos = '';
  public filtro_correo = '';

  public page = 1;
  public pageSize = 10;
  public token:any;
  public load_data = true;

  constructor(
    private _clienteService:ClienteService,
    private _adminService:AdminService
  ){
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data(){
    this._clienteService.listar_cliente_filtro_admin(null, null, this.token).subscribe(
      response=>{
        
        this.clientes = response.data;
        this.load_data = false;
        // setTimeout(()=>{
          
        // }, 2000);
      },
      error =>{
        console.log(error)
      }
    );
  }

  filtro(tipo:any){
    if (tipo == 'apellidos'){
      this.load_data = true;
      this._clienteService.listar_cliente_filtro_admin(tipo, this.filtro_apellidos, this.token).subscribe(
        response=>{
          
          this.clientes = response.data;
          this.load_data = false;
          // setTimeout(()=>{
            
          // }, 2000);
        },
        error =>{
          console.log(error)
        }
      );
    } else if (tipo == 'correo'){
      this.load_data = true;
      this._clienteService.listar_cliente_filtro_admin(tipo, this.filtro_correo, this.token).subscribe(
        response=>{
          this.clientes = response.data;
          this.load_data = false;
        },
        error =>{
          console.log(error)
        }
      );
    }else{
      this.init_data();
    }
  }

  eliminar(id:any){
    this._clienteService.eliminar_cliente_admin(id, this.token).subscribe(
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
          message: 'Se elimino existosamente el cliente.',
          position: 'topCenter',
          transitionIn: 'flipInX',
          transitionOut: 'flipOutX',
          progressBarColor: 'rgb(0, 255, 0)',
          layout: 2,
          timeout: 4000,
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
}
