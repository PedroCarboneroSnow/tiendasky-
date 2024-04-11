import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast:any;

@Component({
  selector: 'app-create-cupon',
  templateUrl: './create-cupon.component.html',
  styleUrls: ['./create-cupon.component.css']
})
export class CreateCuponComponent implements OnInit {

  public cupon : any = {
    tipo : ''
  };

  public token: any;
  public load_btn = false;

  constructor(
    private _cuponService: CuponService,
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
      console.log(this.cupon)
      this._cuponService.registro_cupon_admin(this.cupon, this.token).subscribe(
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
            message: 'Se registro existosamente el cupón.',
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
          this._router.navigate(['panel/cupones']);

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
