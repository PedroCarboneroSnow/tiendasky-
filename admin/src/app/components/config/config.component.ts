import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { AdminService } from 'src/app/services/admin.service';
import { v4 as uuidv4 } from 'uuid';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  public token:any;
  public titulo_cat = '';
  public icono_cat = '';
  public config : any ={};
  public load_btn = false;
  public load_data = true;
  public file = new File([], '');
  public imgSelect: any | ArrayBuffer;
  public id:any;
  public url:any;

  constructor(
    private _adminService: AdminService
  ) { 
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url
    this._adminService.obtener_config_admin(this.token).subscribe(
      response =>{
        this.config = response.data;
        this.imgSelect = this.url+"obtener_logo/"+this.config.logo;
      }, error =>{
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    console.log(this.file.name)
  }


  agregar_cat(){
    if(this.titulo_cat && this.icono_cat){
      this.config.categorias.push({
        titulo: this.titulo_cat,
        icono: this.icono_cat,
        _id: uuidv4()
      });
      this.icono_cat = '';
      this.titulo_cat = '';
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
        message: 'Debe ingresar titulo e icono para la categoria.',
        position: 'topCenter',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        progressBarColor: 'rgb(255, 0, 0)',
        layout: 2,
        timeout: 2000
      });
    }

  }

  actualizar(confForm: NgForm){
    if(confForm.valid){
      
      
      var data:any = {
        titulo: confForm.value.titulo,
        serie: confForm.value.serie,
        correlativo: confForm.value.correlativo,
        categorias: this.config.categorias
      };

      if(this.file.name != ''){
        data.logo = this.file;
      }

      console.log(data);

      this._adminService.actualizar_config_admin('645ef3666cdd6c204c221cac', data, this.token).subscribe(
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
            title: 'Actualización existosa!',
            message: 'Se actualizo existosamente la configuración.',
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
        }, error =>{
          console.log(error);
        }
      );
      

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

  fileChangeEvent(event:any){
    var file;
    if (event.target.files && event.target.files[0]) {
      file = <File>event.target.files[0];
      if (file.size <= 4000000) {
        if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/svg') {
          // Se sube la imagen correctamente
          const reader = new FileReader();
          reader.onload = e => this.imgSelect = reader.result;
          reader.readAsDataURL(file);

          $('.cs-file-drop-icon').addClass('cs-file-drop-preview img-thumbnail rounded');
          $('.cs-file-drop-icon').removeClass('cs-file-drop-icon cxi-upload');


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

 

  eliminar_categoria(idx:any){
    this.config.categorias.splice(idx, 1)
  }
}
