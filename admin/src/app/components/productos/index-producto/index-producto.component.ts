import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

declare var iziToast:any;
declare var jQuery:any;
declare var $:any; 
declare var iziToast:any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  // Exportacion

  public load_data = true;
  public load_btn = false;
  public filtro = '';
  public token: any;
  public productos: any[] = [];
  public arr_productos: any[] = [];
  public page = 1;
  public pageSize = 7;
  public url;

  constructor(
    private _productoService : ProductoService
  ) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data(){
    this._productoService.listar_productos_admin(this.filtro, this.token).subscribe(
      response =>{
        this.productos = response.data;
        this.load_data = false;
        this.productos.forEach(element => {
          this.arr_productos.push({
            titulo: element.titulo,
            stock: element.stock,
            precio: element.precio,
            categoria: element.categoria,
            nventas: element.nventas
          })
        });

        console.log(this.arr_productos)
      }, error =>{
        console.log(error)
      }
    )
  }

  eliminar(id:any){
    this.load_btn = true;
    this._productoService.eliminar_producto_admin(id, this.token).subscribe(
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
          message: 'Se elimino existosamente el producto.',
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
  

  filtrar(){
    this.load_data = true;
    if (this.filtro){
      this._productoService.listar_productos_admin(this.filtro, this.token).subscribe(
        response =>{
          this.productos = response.data;
          this.load_data = false;
        }, error =>{
          console.log(error)
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
        message: 'Ingrese un filtro para buscar.',
        position: 'topCenter',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        progressBarColor: 'rgb(255, 0, 0)',
        layout: 2,
        timeout: 2000
      });
      this.load_data = false;
    }
  }

  resetear(){
    this.load_data = true;
    this.filtro = '';
    
    this.init_data();
    this.load_data = false;
  }

  dowload_excel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de productos");
    worksheet.addRow(undefined);
    for (let x1 of this.arr_productos){
      let x2 = Object.keys(x1);

      let temp = []
      for(let y of x2){
        temp.push(x1[y])

      }
      worksheet.addRow(temp);
    }

    let fname = 'REP01- ';

    worksheet.columns = [
      {
        header: 'Producto', key: 'col01', width: 30
      },
      {
        header: 'Stock', key: 'col02', width: 15
      },
      {
        header: 'Precio', key: 'col03', width: 30, numFmt: '[$S/ ]0.00'
      },
      {
        header: 'Categoria', key: 'col04', width: 25
      },
      {
        header: 'N° ventas', key: 'col05', width: 15
      },
    ]as any;

    workbook.xlsx.writeBuffer().then((data) =>{
      let blob = new Blob([data], {type: 'application(vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, fname + '-' + new Date().valueOf()+'.xlsx') 
    })
  }
}
