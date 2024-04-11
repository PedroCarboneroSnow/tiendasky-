import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast:any;

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css']
})
export class EditClienteComponent implements OnInit {

  public cliente : any = {
    genero : ''
  };

  public token: any;

  public id:any;
  public load_btn = false;
  public load_data = true;

  constructor(private _route: ActivatedRoute,
    private _clienteService : ClienteService,
    private _adminService: AdminService,
    private _router:Router) { 
      this.token = this._adminService.getToken();
    }

  ngOnInit(): void {
    this._route.params.subscribe(
      params =>{
        this.id = params['id'];

        this._clienteService.obtener_cliente_admin(this.id,this.token).subscribe(
          response => {
            if(response.data == undefined){
              this.cliente = undefined;
              this.load_data = false;
            }else{
              this.cliente = response.data;
              this.load_data = false;
            }
          }, error => {
            console.log(error);
          }
        );
      }
    );
  }

  actualizar(updateForm: NgForm){
    if (updateForm.valid){
      this.load_btn = true;
      this._clienteService.actualizar_cliente_admin(this.id, this.cliente, this.token).subscribe(
        response => {
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
            message: 'Se actualizó existosamente el cliente.',
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
          this.load_btn = false;
          this._router.navigate(['panel/clientes']);

        }, error => {
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
        message: 'Los datos del formulario no son válidos.',
        position: 'topCenter',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        progressBarColor: 'rgb(255, 0, 0)',
        layout: 2,
        timeout: 2000
      });
      this.load_btn = false;
    }
  }

}
