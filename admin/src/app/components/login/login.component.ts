import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

declare var jQuery:any;
declare var $:any; 
declare var iziToast:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit{
  public user : any = {};
  public usuario: any = {};
  public token: any = '';

  constructor(
   private _adminService:AdminService,
   private _router:Router
  ){
    this.token = this._adminService.getToken();
  }
  
  ngOnInit(): void {
    console.log(this.token);
    if(this.token){
      this._router.navigate(['']);
    }else{

    }

    

  }

  login(loginForm: NgForm){
    if (loginForm.valid){
      let data = {
        email: this.user.email,
        password: this.user.password
      };

      this._adminService.login_admin(data).subscribe(
      response =>{
        if (response.data == undefined){
          iziToast.show({
            id: 'toast-failed',
            titleSize: 18,
            titleLineHeight: 20,
            messageSize: 14,
            messageLineHeight: 20,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/753/753345.png ",
            color: '#FCC8C2',
            title: 'Error',
            message: response.message,
            position: 'topCenter',
            transitionIn: 'flipInX',
            transitionOut: 'flipOutX',
            progressBarColor: 'rgb(255, 0, 0)',
            layout: 2,
            timeout: 2000
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
            color: '#C4F7C6',
            title: 'Login existoso!',
            message: 'Iniciaste sesion exitosamente.',
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

          this._router.navigate(['']);
        }
      },
      error=>{
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
        iconUrl: "https://cdn-icons-png.flaticon.com/512/753/753345.png ",
        color: '#FCC8C2',
        title: 'Error',
        message: 'Los datos del formulario no son válidos.',
        position: 'topCenter',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        progressBarColor: 'rgb(255, 0, 0)',
        layout: 2,
        timeout: 2000
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
}
