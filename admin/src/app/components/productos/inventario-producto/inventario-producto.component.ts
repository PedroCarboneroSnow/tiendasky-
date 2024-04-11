import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

declare var $:any; 
declare var iziToast:any;

@Component({
  selector: 'app-inventario-producto',
  templateUrl: './inventario-producto.component.html',
  styleUrls: ['./inventario-producto.component.css']
})
export class InventarioProductoComponent implements OnInit {
  public config: any = {};
  public producto: any = {};
  public inventario: any[] = [];
  public arr_inventario : any[] = [];
  public add_inventario : any = {};
  
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
    this.init_data();
    
  }

  init_data(){
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
          response => {
            if(response.data == undefined){
              this.producto = undefined;
              console.log(this.producto)
            }else{
              this.producto = response.data;
              
              this._productoService.listar_inventario_producto_admin(this.id, this.token).subscribe(
                response => {
                  this.load_data = false;
                  this.inventario = response.data;
                  this.inventario.forEach(element => {
                    this.arr_inventario.push({
                      admin: element.admin.nombres + ' ' + element.admin.apellidos,
                      cantidad: element.cantidad,
                      proveedor: element.proveedor,
                    })
                  });
                  console.log(this.inventario)
                }, error =>{
                  console.log(error);
                }
              )
            }
            
          }, error => {
            console.log(error);
          }
        );
      }
    )
  }

  eliminar(id:any){
    this.load_btn = true;
    console.log(id)
    this._productoService.eliminar_inventario_producto_admin(id, this.token).subscribe(
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
          title: 'Existoso!',
          message: 'Se elimino existosamente el cliente.',
          position: 'topCenter',
          transitionIn: 'flipInX',
          transitionOut: 'flipOutX',
          progressBarColor: 'rgb(0, 255, 0)',
          layout: 2,
          timeout: 2000,
          onClose: function() {
            // console.info('onClose');
          },
        });

        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');
        

        this.load_btn = false;
        this.load_data = false;
        this.init_data();

      }, error =>{
        iziToast.show({
          id: 'toast-failed',
          titleSize: 18,
          titleLineHeight: 20,
          messageSize: 14,
          messageLineHeight: 20,
          iconUrl: "https://cdn-icons-png.flaticon.com/512/753/753345.png ",
          color: '#FCC8C2',
          title: 'Error',
          message: 'Ocurrio un error en el servidor.',
          position: 'topCenter',
          transitionIn: 'flipInX',
          transitionOut: 'flipOutX',
          progressBarColor: 'rgb(255, 0, 0)',
          layout: 2,
          timeout: 2000
        });
        console.log(error)
        this.load_btn = false;
        this.load_data = false;
      }
    );
  }

  registro_inventario(inventarioForm: NgForm){
    if (inventarioForm.valid) {

      let data = {
        producto: this.producto._id,
        cantidad: inventarioForm.value.cantidad,
        admin: this.id_user,
        proveedor: inventarioForm.value.proveedor
      }

      console.log(data)
      this._productoService.registro_inventario_producto_admin(data, this.token).subscribe(
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
            message: 'Se registro existosamente el producto.',
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
          this.init_data();
        }, error =>{
          console.log(error)
        }
      )
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

  dowload_excel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de productos");
    worksheet.addRow(undefined);
    for (let x1 of this.arr_inventario){
      let x2 = Object.keys(x1);

      let temp = []
      for(let y of x2){
        temp.push(x1[y])

      }
      worksheet.addRow(temp);
    }

    let fname = 'REP01 ';

    worksheet.columns = [
      {
        header: 'Trabajador', key: 'col01', width: 30
      },
      {
        header: 'Cantidad', key: 'col02', width: 15
      },
      {
        header: 'Proveedor', key: 'col03', width: 30
      }
    ]as any;

    workbook.xlsx.writeBuffer().then((data) =>{
      let blob = new Blob([data], {type: 'application(vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, fname + '-' + new Date().valueOf()+'.xlsx') 
    })
  }
}
