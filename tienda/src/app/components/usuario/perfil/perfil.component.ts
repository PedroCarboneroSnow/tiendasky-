import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClienteService } from 'src/app/services/cliente.service';

declare var jQuery:any;
declare var $:any; 
declare var iziToast:any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public cliente: any = {};
  public token:any;
  public id: any;
  public user: any = undefined;

  constructor(
    private _clienteService : ClienteService
  ) { 
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');

    
    if(this.token){
      this._clienteService.obtener_cliente_guest(this.id, this.token).subscribe(
        response =>{
          this.cliente = response.data;
          
        }, error =>{
          console.log(error)
          this.cliente = undefined;
        }
      );
    }
  }

  ngOnInit(): void {
    
  }

  mostrarPassword(){
    var cambio:any = document.getElementById("input_password");
		if(cambio.type == "password"){
			cambio.type = "text";
			$('.icon').removeClass('cxi-eye').addClass('cxi-eye-closed');
		}else{
			cambio.type = "password";
			$('.icon').removeClass('cxi-eye-closed').addClass('cxi-eye');
		}
  }

  actualizar(actualizarForm: NgForm){
    if(actualizarForm.valid){
      
      this.cliente.password = $('#input_password').val();
      console.log(this.cliente.password)
      this._clienteService.actualizar_cliente_guest(this.id, this.cliente, this.token).subscribe(
        response => {
          console.log(response)
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
            message: 'Se actualizo el perfil correctamente.',
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
        iconUrl: "https://cdn-icons-png.flaticon.com/512/9068/9068699.png",
        titleColor: '#FF0000',
        color: '#FFFBFB',
        title: 'Error',
        message: 'Los datos del formulario no son válidos.',
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
