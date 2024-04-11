import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast:any;

@Component({
  selector: 'app-update-cupon',
  templateUrl: './update-cupon.component.html',
  styleUrls: ['./update-cupon.component.css']
})
export class UpdateCuponComponent implements OnInit {

  public cupon : any = {
    tipo : ''
  };
  public id:any;
  public token: any;
  public load_btn = false;
  public load_data = true;

  constructor(
    private _cuponService: CuponService,
    private _adminService:AdminService,
    private _router:Router,
    private _route:ActivatedRoute
  ) { 
    this.token = this._adminService.getToken();
  }


  ngOnInit(): void {
    this._route.params.subscribe(
      params =>{
        this.id = params['id'];
        console.log(this.id)
        this._cuponService.obtener_cupon_admin(this.id,this.token).subscribe(
          response => {
            console.log(response.data)
            if(response.data == undefined){
              this.cupon = undefined;
              this.load_data = false;
            }else{
              this.cupon = response.data;
              this.load_data = false;
            }
          }, error => {
            console.log(error);
          }
        );
      }
    );
  }

  update(updateForm: NgForm){
    if (updateForm.valid){
      this.load_btn = true;
      this._cuponService.actualizar_cupon_admin(this.id, this.cupon, this.token).subscribe(
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
            message: 'Se actualizó existosamente el cupón.',
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

