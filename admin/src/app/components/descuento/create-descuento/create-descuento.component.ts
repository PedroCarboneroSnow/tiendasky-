import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { DescuentosService } from 'src/app/services/descuentos.service';

declare var iziToast: any;
declare var $: any;

@Component({
  selector: 'app-create-descuento',
  templateUrl: './create-descuento.component.html',
  styleUrls: ['./create-descuento.component.css']
})
export class CreateDescuentoComponent implements OnInit {
  public descuento: any = {};
  public file = new File([], '');
  public token: any;
  public load_btn = false;
  public imgSelect: any | ArrayBuffer = "/assets/img/img_defecto.png";

  constructor(
    private _descuetnoService: DescuentosService,
    private _adminService: AdminService,
    private _router: Router
  ) { 
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
  }

  registro(registroForm: NgForm) {
    if (registroForm.valid) {
      if (this.file.name != '') {
       if(this.descuento.descuento >= 1 && this.descuento.descuento <= 100){
        this.load_btn = true;
        this._descuetnoService.registro_descuento_admin(this.descuento, this.file, this.token).subscribe(
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
              title: 'Registro existoso!',
              message: 'Se registro existosamente el descuento.',
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
            this._router.navigate(['panel/descuentos']);
          }, error => {
            this.load_btn = false;
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
          message: 'El descuento debe ser entre 1% y 100%.',
          position: 'topCenter',
          transitionIn: 'flipInX',
          transitionOut: 'flipOutX',
          progressBarColor: 'rgb(255, 0, 0)',
          layout: 2,
          timeout: 2000
        });
       }
      } else {
        iziToast.show({
          id: 'toast-failed',
          titleSize: 18,
          titleLineHeight: 20,
          messageSize: 14,
          messageLineHeight: 20,
          iconUrl: "https://cdn-icons-png.flaticon.com/512/753/753345.png ",
          color: '#FCC8C2',
          title: 'Error',
          message: 'No hay una imagen de envio.',
          position: 'topCenter',
          transitionIn: 'flipInX',
          transitionOut: 'flipOutX',
          progressBarColor: 'rgb(255, 0, 0)',
          layout: 2,
          timeout: 2000
        });
        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect = "/assets/img/img_defecto.png";
        this.file = new File([], '');
      }

    } else {
      this.load_btn = false;
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


  fileChangeEvent(event: any): void {
    var file;
    if (event.target.files && event.target.files[0]) {
      file = <File>event.target.files[0];
      if (file.size <= 4000000) {
        if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/gif') {
          // Se sube la imagen correctamente
          const reader = new FileReader();
          reader.onload = e => this.imgSelect = reader.result;
          reader.readAsDataURL(file);

          $('#input-portada').text(file.name);

          this.file = file;

        } else {
          iziToast.show({
            id: 'toast-failed',
            titleSize: 18,
            titleLineHeight: 20,
            messageSize: 14,
            messageLineHeight: 20,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/753/753345.png ",
            color: '#FCC8C2',
            title: 'Error',
            message: 'El archivo de imagen debe ser una imagen.',
            position: 'topCenter',
            transitionIn: 'flipInX',
            transitionOut: 'flipOutX',
            progressBarColor: 'rgb(255, 0, 0)',
            layout: 2,
            timeout: 2000
          });
          $('#input-portada').text('Seleccionar imagen');
          this.imgSelect = "/assets/img/img_defecto.png";
          this.file = new File([], '');
        }
      } else {
        iziToast.show({
          id: 'toast-failed',
          titleSize: 18,
          titleLineHeight: 20,
          messageSize: 14,
          messageLineHeight: 20,
          iconUrl: "https://cdn-icons-png.flaticon.com/512/753/753345.png ",
          color: '#FCC8C2',
          title: 'Error',
          message: 'La imagen no puede superar los 4MB.',
          position: 'topCenter',
          transitionIn: 'flipInX',
          transitionOut: 'flipOutX',
          progressBarColor: 'rgb(255, 0, 0)',
          layout: 2,
          timeout: 2000
        });
        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect = "/assets/img/img_defecto.png";
        this.file = new File([], '');
      }
    } else {
      iziToast.show({
        id: 'toast-failed',
        titleSize: 18,
        titleLineHeight: 20,
        messageSize: 14,
        messageLineHeight: 20,
        iconUrl: "https://cdn-icons-png.flaticon.com/512/753/753345.png ",
        color: '#FCC8C2',
        title: 'Error',
        message: 'No hay una imagen de envio.',
        position: 'topCenter',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        progressBarColor: 'rgb(255, 0, 0)',
        layout: 2,
        timeout: 2000
      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = "/assets/img/img_defecto.png";
      this.file = new File([], '');
    }
  }
}
