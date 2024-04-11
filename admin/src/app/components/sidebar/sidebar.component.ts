import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { AdminService } from 'src/app/services/admin.service';

declare var $:any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public token:any;
  public config : any ={};
  public load_btn = false;
  public load_data = true;
  public file = new File([], '');
  public imgSelect: any;
  public id:any;
  public url:any;

  constructor(
    private _router:Router,
    private _adminService: AdminService
  ) { 
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url
    this._adminService.obtener_config_admin(this.token).subscribe(
      response =>{
        this.load_data = false;
        this.config = response.data;
        this.imgSelect = this.url+"obtener_logo/"+this.config.logo;
        
      }, error =>{
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
  }

  

  logout(){
    window.location.reload();
    localStorage.clear();
    this._router.navigate(['/']);
  }

  mostrar(){
    
  }

  ocultar(){
    // $("#navbarCollapse").hide();
    // $('.offcanvas-backdrop').remove();
    // $('body').removeAttr('style');
  }

}
