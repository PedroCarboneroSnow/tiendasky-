import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  public url:any;
  
  constructor(private _http: HttpClient) { 
    
    this.url = GLOBAL.url;
  }

  login_cliente(data: any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url+'login_cliente', data, {headers: headers});
  }

  registro_cliente(data: any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url+'registro_cliente', data, {headers: headers});
  }

  registro_y_login_cliente(data: any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url+'registro_y_login_cliente', data, {headers: headers});
  }

  obtener_cliente_guest(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.get(this.url+'obtener_cliente_guest/' + id,{headers: headers});
  }

  actualizar_cliente_guest(id:any, data:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.put(this.url+'actualizar_cliente_guest/' + id, data,{headers: headers});
  }

  // Validacion del token
  public isAuthenticated(): boolean {
    
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
        localStorage.clear();
        return false;
      }

    } catch (error) {
      localStorage.clear();
      return false;
    }

    return true;
  }

  obtener_categorias_public():Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json'});
    return this._http.get(this.url+'obtener_categorias_public/',{headers: headers});
  }

  listar_producto_public(filtro:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json'});
    return this._http.get(this.url+'listar_producto_public/'+filtro,{headers: headers});
  }

  agregar_carrito_cliente(data:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.post(this.url+'agregar_carrito_cliente', data, {headers: headers});
  }

  obtener_carrito_cliente(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.get(this.url+'obtener_carrito_cliente/'+id,{headers: headers});
  }

  eliminar_carrito_cliente(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.delete(this.url+'eliminar_carrito_cliente/'+id,{headers: headers});
  }

  registro_direccion_cliente(data:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.post(this.url+'registro_direccion_cliente', data, {headers: headers});
  }

  obtener_direccion_cliente(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.get(this.url+'obtener_direccion_cliente/'+id,{headers: headers});
  }

  cambiar_direccion_cliente_principal(id:any, cliente:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.put(this.url+'cambiar_direccion_cliente_principal/'+id+'/'+cliente, {data:true}, {headers: headers});
  }

  obtener_direccion_principal_cliente(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.get(this.url+'obtener_direccion_principal_cliente/'+id, {headers: headers});
  }

  // Detalles de venta // Venta
  registro_compra_cliente(data:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.post(this.url+'registro_compra_cliente', data, {headers: headers});
  }


  // Enviar Correo

  enviar_correo_compra_cliente(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.get(this.url+'enviar_correo_compra_cliente/' + id, {headers: headers});
  }
  
  // Validar cupon

  validar_cupon_cliente(cupon:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.get(this.url+'validar_cupon_cliente/' + cupon, {headers: headers});
  }

  // Ordenes
  obtener_ordenes_cliente(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.get(this.url+'obtener_ordenes_cliente/' + id, {headers: headers});
  }

  obtener_detalle_ordene_cliente(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.get(this.url+'obtener_detalle_ordene_cliente/' + id, {headers: headers});
  }

  // review
  emitir_review_producto_cliente(data:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization':token});
    return this._http.post(this.url+'emitir_review_producto_cliente', data, {headers: headers});
  }

  obtener_review_producto_cliente(id: any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url+'obtener_review_producto_cliente/' +id, {headers: headers});
  }

  // Culqui

  get_token_culqi(data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer pk_test_UTCQSGcXW8bCyU59');
    return this._http.post('https://api.culqi.com/v2/tokens/', data, {headers: headers});
  }

  get_charge_culqi(data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer sk_test_UTCQSGcXW8bCyU599');
    return this._http.post('https://api.culqi.com/v2/charges/', data, {headers: headers});
  }


  // D-Local Go

  get_token_DlocalGo(data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer dbIuAzxDvrPUYJeJIAAVoxgBJdPLquKe:dbIuAzxDvrPUYJeJIAAVoxgBJdPLquKe');
    return this._http.post('https://api.dlocalgo.com/v1/payments', data, {headers: headers});
  } 
}
