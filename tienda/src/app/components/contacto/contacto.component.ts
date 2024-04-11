import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GuestService } from 'src/app/services/guest.service';

declare var $: any;
declare var iziToast: any;

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  public contacto: any = {};
  public load_btn = false; 

  constructor(
    private _guestService: GuestService
  ) { }

  ngOnInit(): void {
  }

  registro(registroForm: NgForm) {
    if (registroForm.valid) {
      this.load_btn = true;
      this._guestService.enviar_mensaje_contacto(this.contacto).subscribe(
        response =>{
          console.log(response);
          iziToast.show({
            id: 'toast-success',
            //theme: 'light',
            titleSize: 18,
            titleLineHeight: 20,
            messageSize: 14,
            messageLineHeight: 20,
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png ',
            titleColor: '#02AC26',
            title: '¡Mensaje enviado!',
            message: 'Se envio correctamente el mensaje.',
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

          this.contacto = {};

          setTimeout(() => {
            this.load_btn = false;
          }, 2200);
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
