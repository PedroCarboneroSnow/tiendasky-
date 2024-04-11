import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';


declare var iziToast:any;


@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html',
  styleUrls: ['./create-cliente.component.css']
})
export class CreateClienteComponent implements OnInit {
  public cliente : any = {
    genero : ''
  };

  public token: any;
  public load_btn = false;

  constructor(
    private _clienteService: ClienteService,
    private _adminService:AdminService,
    private _router:Router
  ) { 
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
  }

  registro(registroForm: NgForm){
    if (registroForm.valid){
      

      this.load_btn = true;
      this._clienteService.registro_cliente_admin(this.cliente, this.token).subscribe(
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
            title: 'Registro existoso!',
            message: 'Se registro existosamente el cliente.',
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

          this.cliente = {
            genero: '',
            nombres: '',
            apellidos: '',
            f_nacimiento: '',
            telefono: '',
            dni: '',
            email: ''
          }

          this.load_btn = false;
          this._router.navigate(['panel/clientes']);

        },error =>{
          console.log(error);
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
}
