import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';

declare var jQuery:any;
declare var $:any; 
declare var iziToast:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user : any = {};
  public reg_user : any = {};
  public usuario : any = {};
  public token : any;

  constructor(
    private _clienteService: ClienteService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token');

    if(this.token){
      this._router.navigate(['/']);
    }
    
   }

  ngOnInit(): void {
  }

  

  login(loginForm: NgForm){
    if(loginForm.valid){
      console.log(this.user)

      let data = {
        email: this.user.email,
        password: this.user.password
      };

      this._clienteService.login_cliente(data).subscribe(
      response =>{
        if (response.data == undefined){
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
            message: response.message,
            class: 'text-danger',
            position: 'topCenter',
            transitionIn: 'flipInX',
            transitionOut: 'flipOutX',
            progressBarColor: 'rgb(255, 0, 0)',
            layout: 2,
            timeout: 1500
          });
        }else{
          this.usuario = response.data;
          localStorage.setItem('token', response.token);
          localStorage.setItem('_id', response.data._id)
          iziToast.show({
            id: 'toast-success',
            //theme: 'light',
            titleSize: 18,
            titleLineHeight: 20,
            messageSize: 14,
            messageLineHeight: 20,
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png ',
            titleColor: '#02AC26',
            title: '¡Login existoso!',
            message: 'Iniciaste sesion exitosamente.',
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

          
          this._router.navigate(['']);
        }
      }, error=>{
        console.log(error);
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
        message: 'Los datos no son válidos.',
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

  registro(registroForm: NgForm) {
    if (registroForm.valid) {
      console.log(this.reg_user);
      
      this._clienteService.registro_y_login_cliente(this.reg_user).subscribe(
        response =>{
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
              message: response.message,
              class: 'text-danger',
              position: 'topCenter',
              transitionIn: 'flipInX',
              transitionOut: 'flipOutX',
              progressBarColor: 'rgb(255, 0, 0)',
              layout: 2,
              timeout: 1500
            });
          } else {
            console.log(response.data);
            this.usuario = response.data;
            localStorage.setItem('token', response.token);
            localStorage.setItem('_id', response.data._id);
            iziToast.show({
              id: 'toast-success',
              titleSize: 18,
              titleLineHeight: 20,
              messageSize: 14,
              messageLineHeight: 20,
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
              titleColor: '#02AC26',
              title: '¡Registro Exitoso!',
              message: 'Te registraste exitosamente.',
              position: 'topCenter',
              transitionIn: 'flipInX',
              transitionOut: 'flipOutX',
              progressBarColor: '#02A324',
              color: '#FAFFFB',
              layout: 2,
              timeout: 1500,
              onClose: function() {
                // console.info('onClose');
              }
            });

            this._router.navigate(['']);
        }
      });

    } else {
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
        message: 'Los datos no son válidos.',
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
  

  mostrarPassword(){
    var cambio:any = document.getElementById("signin-password");
		if(cambio.type == "password"){
			cambio.type = "text";
			$('.icon').removeClass('cxi-eye').addClass('cxi-eye-closed');
		}else{
			cambio.type = "password";
			$('.icon').removeClass('cxi-eye-closed').addClass('cxi-eye');
		}
  }

  mostrarPassword2(){
    var cambio:any = document.getElementById("signin-password2");
		if(cambio.type == "password"){
			cambio.type = "text";
			$('.icon2').removeClass('cxi-eye').addClass('cxi-eye-closed');
		}else{
			cambio.type = "password";
			$('.icon2').removeClass('cxi-eye-closed').addClass('cxi-eye');
		}
  }
}
