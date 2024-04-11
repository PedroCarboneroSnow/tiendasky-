import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { AdminService } from 'src/app/services/admin.service';
import { DescuentosService } from 'src/app/services/descuentos.service';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-edit-descuento',
  templateUrl: './edit-descuento.component.html',
  styleUrls: ['./edit-descuento.component.css']
})
export class EditDescuentoComponent implements OnInit {
  public descuentos: any = {};
  public config: any = {};

  public file = new File([], '');
  public token: any;
  public load_btn = false;
  public load_data = true;
  public imgSelect: any | ArrayBuffer = "/assets/img/img_defecto.png";
  public id:any;
  public url:any;

  public config_global : any = {}
  constructor(
    private _descuentoService: DescuentosService,
    private _adminService: AdminService,
    private _router: Router,
    private _route: ActivatedRoute 
  ) { 
    this.url = GLOBAL.url;
      this.token = this._adminService.getToken();
      this.config = {
        height: 500
      }
      
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this._descuentoService.obtener_descuento_admin(this.id, this.token).subscribe(
          response => {
            if(response.data == undefined){
              this.descuentos = undefined;
              this.load_data = false;
            }else{
              
              this.descuentos = response.data;
              this.imgSelect = this.url +'/obtener_banner/' + this.descuentos.banner;
              this.load_data = false;
            }
          }, error => {
            console.log(error);
          }
        );
      }
    )
  }

  actualizar(actualizarForm: NgForm){
    if(actualizarForm.valid){
      
      if(this.descuentos.descuento >= 1 && this.descuentos.descuento <= 100){
        var data:any = {};

        if(this.file.name != ''){
          data.banner = this.file;
        }
  
        data.titulo = this.descuentos.titulo;
        data.fecha_inicio = this.descuentos.fecha_inicio;
        data.fecha_fin = this.descuentos.fecha_fin;
        data.descuento = this.descuentos.descuento;
        this.load_btn = true;
        
        this._descuentoService.actualizar_descuento_admin(data, this.id, this.token).subscribe(
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
              message: 'Se actualizo existosamente el descuento.',
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
          }, error =>{
            console.log(error)
            this.load_btn = false;
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
          message: 'El descuento debe ser entre 1% y 100%.',
          position: 'topCenter',
          transitionIn: 'flipInX',
          transitionOut: 'flipOutX',
          progressBarColor: 'rgb(255, 0, 0)',
          layout: 2,
          timeout: 2000
        });
      }
    }else{
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
      this.load_btn = false;
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
