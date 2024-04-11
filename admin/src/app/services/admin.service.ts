import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgModel } from '@angular/forms';
import { JwtHelperService, JwtModule } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public url:any;
  
  constructor(private _http: HttpClient) { 
    
    this.url = GLOBAL.url;
  }

  login_admin(data: any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url+'login_admin', data, {headers: headers});
  }

  getToken(){
    return localStorage.getItem('token');
  }

  // Validacion del token
  public isAuthenticated(allowRoles: string[]): boolean {
    
    // Obtener el token             Muy complejo:(
    
    const token: any = localStorage.getItem('token');

    // Validar si existe un token o no

    if (!token) {
      return false;
    }

    // Validar la decodificacion del token
    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(token);

      if(helper.isTokenExpired(token)){
        localStorage.clear();
        return false;
      }
      
      if (!decodedToken) {
        localStorage.removeItem('token');
        return false;
      }

    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }

    return allowRoles.includes(decodedToken['role']);
  }

  obtener_config_admin( token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.get(this.url+'obtener_config_admin/',{headers: headers});
  }

  actualizar_config_admin(id:any, data:any, token:any):Observable<any>{
    if(data.logo){
      let headers = new HttpHeaders({'Authorization': token});

      const fd = new FormData();
  
      fd.append('titulo', data.titulo);
      fd.append('serie', data.serie);
      fd.append('correlativo', data.correlativo);
      fd.append('categorias', JSON.stringify(data.categorias));
      fd.append('logo', data.logo);
      return this._http.put(this.url+'actualizar_config_admin/'+id, fd,{headers: headers});
    }else{
      let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
      return this._http.put(this.url+'actualizar_config_admin/'+id,data,{headers: headers});
    }
    
  }

  obtener_categorias_public():Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json'});
    return this._http.get(this.url+'obtener_categorias_public/',{headers: headers});
  }

  obtener_mensajes_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.get(this.url+'obtener_mensajes_admin/',{headers: headers});
  }

  cerrar_mensajes_admin(id:any, data:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.put(this.url+'cerrar_mensajes_admin/'+id, data,{headers: headers});
  }

  obtener_ventas_admin(desde:any, hasta:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.get(this.url+'obtener_ventas_admin/'+desde+'/' + hasta,{headers: headers});
  }

  obtener_detalle_ordene_cliente(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.get(this.url+'obtener_detalle_ordene_cliente/' + id, {headers: headers});
  }

  // KPI
  kpi_ganancias_mensuales_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.get(this.url+'kpi_ganancias_mensuales_admin', {headers: headers});
  }

}
