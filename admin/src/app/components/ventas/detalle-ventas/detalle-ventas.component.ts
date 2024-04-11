import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-detalle-ventas',
  templateUrl: './detalle-ventas.component.html',
  styleUrls: ['./detalle-ventas.component.css']
})
export class DetalleVentasComponent implements OnInit {
  public total_star:any = 5;
  public estar:any;

  public url:any;
  public token:any;
  public load_data = true;
  public orden :any = {};
  public detalles : Array<any> = [];
  public id:any;
  public review:any = {};

  constructor(
    private _adminService: AdminService,
    private _activatedRoute: ActivatedRoute
  ) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._activatedRoute.params.subscribe(
      params =>{
        this.id = params['id'];
        this.init_data();
        
      }
    );
  }


  ngOnInit(): void {
  }

  init_data(){
    this._adminService.obtener_detalle_ordene_cliente(this.id, this.token).subscribe(
      response =>{
        if(response.data != undefined){
          this.orden = response.data;
          this.detalles = response.detalles;
          this.load_data = false;
        }else{
          this.orden = undefined;
        }
      }
    );
  }
}
