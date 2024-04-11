import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClienteService } from 'src/app/services/cliente.service';
import { GuestService } from 'src/app/services/guest.service';

declare var $: any;
declare var iziToast: any;


@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css']
})
export class DireccionesComponent implements OnInit {
  public direcciones: Array<any> = [];
  
  public direccion: any = {
    pais: '',
    provincia: '',
    region: '',
    distrito: '',
    principal: false
  };
  public token: any;

  public regiones: Array<any> = [];
  public provincias: Array<any> = [];
  public distritos: Array<any> = [];

  public regiones_arr: Array<any> = [];
  public provincias_arr: Array<any> = [];
  public distritos_arr: Array<any> = [];

  public load_data = true;


  constructor(private _guestService: GuestService,
    private _clienteService: ClienteService) {
    this.token = localStorage.getItem('token');
    this._guestService.get_provincias().subscribe(
      response => {
        this.provincias_arr = response
      }
    );

    this._guestService.get_regiones().subscribe(
      response => {
        this.regiones_arr = response
      }
    );
    
    this._guestService.get_distritos().subscribe(
      response => {
        this.distritos_arr = response
      }
    );

  }

  ngOnInit(): void {
    this.obtener_direccion();
  }

  obtener_direccion(){
    this._clienteService.obtener_direccion_cliente(localStorage.getItem('_id'), this.token).subscribe(
      response=>{
        this.direcciones = response.data;

        this.load_data = false;
      }
    );
  }

  establecer_principal(id:any){
    this._clienteService.cambiar_direccion_cliente_principal(id, localStorage.getItem('_id') ,this.token).subscribe(
      response=>{
        this.obtener_direccion();
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
          message: 'Se actualizo la dirección principal.',
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
      }
    );
  }

  select_pais() {
    if (this.direccion.pais == 'Perú') {
      $('#sl-region').prop('disabled', false);
      this._guestService.get_regiones().subscribe(
        response => {
          response.forEach((element: any) => {
            this.regiones.push({
              id: element.id,
              name: element.name
            });
          });
        }
      );
    } else {
      $('#sl-region').prop('disabled', true);
      $('#sl-provincia').prop('disabled', true);
      $('#sl-distrito').prop('disabled', true);
      this.regiones = [];
      this.provincias = [];
      this.direccion.region = '';
      this.direccion.provincia = '';
      this.direccion.distrito = '';
    }
  }

  select_region() {
    this.provincias = [];

    $('#sl-provincia').prop('disabled', false);
    $('#sl-distrito').prop('disabled', true);
    this.direccion.provincia = '';
    this.direccion.distrito = '';
    this._guestService.get_provincias().subscribe(
      response => {
        response.forEach((element: any) => {
          if (element.department_id == this.direccion.region) {
            this.provincias.push({
              id: element.id,
              name: element.name
            });
          }


        });

      }
    );
  }

  select_distrito() {
    this.distritos = [];
    $('#sl-distrito').prop('disabled', false);
    this.direccion.distrito = '';
    this._guestService.get_distritos().subscribe(
      response => {
        response.forEach((element: any) => {
          if (element.province_id == this.direccion.provincia) {
            this.distritos.push({
              id: element.id,
              name: element.name
            });
          }
        });

      }
    );
  }

  registrar(registroForm: NgForm) {
    if (registroForm.valid) {

      this.regiones_arr.forEach((element:any) => {
        if(parseInt(element.id) == parseInt(this.direccion.region)){
          this.direccion.region = element.name 
        }
      });

      this.provincias_arr.forEach((element:any) => {
        if(parseInt(element.id) == parseInt(this.direccion.provincia)){
          this.direccion.provincia = element.name 
        }
      });

      this.distritos_arr.forEach((element:any) => {
        if(parseInt(element.id) == parseInt(this.direccion.distrito)){
          this.direccion.distrito = element.name 
        }
      });


      let data = {
        destinatario: this.direccion.destinatario,
        dni: this.direccion.dni,
        zip: this.direccion.zip,
        telefono: this.direccion.telefono,
        pais: this.direccion.pais,
        region: this.direccion.region,
        distrito: this.direccion.distrito,
        provincia: this.direccion.provincia,
        direccion: this.direccion.direccion,
        principal: this.direccion.principal,
        cliente: localStorage.getItem('_id')
      }
      
      this._clienteService.registro_direccion_cliente(data, this.token).subscribe(
        response => {
          this.direccion = {
            pais: '',
            provincia: '',
            region: '',
            distrito: '',
            principal: false
          };

          $('#sl-region').prop('disabled', true);
          $('#sl-provincia').prop('disabled', true);
          $('#sl-distrito').prop('disabled', true);

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
            message: 'Se agrego la dirección correctamente.',
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

          this.obtener_direccion();
        }
      );

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

