import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import Chart from 'chart.js/auto'

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public token: any;
  public total_ganancia:any;
  public total_mes:any;
  public count_ventas:any;
  public total_mes_anterior:any;
  
  constructor(
    private _adminService: AdminService
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.init_data();

    

  }

  init_data() {
    this._adminService.kpi_ganancias_mensuales_admin(this.token).subscribe(
      response => {
        this.total_ganancia = response.total_ganancia;
        this.total_mes = response.total_mes;
        this.count_ventas = response.count_ventas;
        this.total_mes_anterior = response.total_mes_anterior;

        var canvas = <HTMLCanvasElement>document.getElementById('myChart');
        var ctx = canvas.getContext('2d')!;
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [{
              label: 'Meses',
              data: [response.enero, response.febrero, response.marzo, response.abril, response.mayo, response.junio, response.julio,
                    response.agosto, response.septiembre, response.octubre, response.noviembre, response.diciembre],
              fill: false,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgb(75, 192, 192)',
              ],
              borderWidth: 2
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          },

        });
      }
    );
  }

}
