import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-reviews-producto',
  templateUrl: './reviews-producto.component.html',
  styleUrls: ['./reviews-producto.component.css']
})
export class ReviewsProductoComponent implements OnInit {
  public config: any = {};
  public producto: any = {};
  public reviews: any[] = [];
  
  public load_data = true;
  public load_btn = false;
  
  public filtro = '';
  public token: any;
  public page = 1;
  public pageSize = 7;
  public url:any;
  public id:any;
  public id_user:any;

  constructor(
    private _productoService: ProductoService,
    private _adminService: AdminService,
    private _router: Router,
    private _route: ActivatedRoute

  ) { 
    this.url = GLOBAL.url;
      this.token = this._adminService.getToken();
      this.id_user = localStorage.getItem('_id');
      this.config = {
        height: 500
      }

  }


  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
          response => {
            if(response.data == undefined){
              this.producto = undefined;
            }else{
              this.producto = response.data;

              this._productoService.obtener_reviews_publico_producto(this.producto._id).subscribe(
                response =>{
                  this.reviews = response.data;
                  console.log(this.reviews)
                }
              );
            }
          }, error => {
            console.log(error);
          }
        );
      }
    )
  }

}
