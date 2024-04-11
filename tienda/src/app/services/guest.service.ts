import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  public url:any;
  
  constructor(private _http: HttpClient) { 
    
    this.url = GLOBAL.url;
  }

  obtener_producto_slug_public(slug:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json'});
    return this._http.get(this.url+'obtener_producto_slug_public/'+slug,{headers: headers});
  }

  listar_producto_recomendados_public(categoria:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json'});
    return this._http.get(this.url+'listar_producto_recomendados_public/'+categoria,{headers: headers});
  }

  get_regiones():Observable<any>{
    return this._http.get('././assets/regiones.json');
  }

  get_distritos():Observable<any>{
    return this._http.get('././assets/distritos.json');
  }

  get_provincias():Observable<any>{
    return this._http.get('././assets/provincias.json');
  }

  get_envios():Observable<any>{
    return this._http.get('././assets/envios.json');
  }

  obtener_descuento_activo():Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json'});
    return this._http.get(this.url+'obtener_descuento_activo',{headers: headers});
  }

  listar_producto_public_nuevos():Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json'});
    return this._http.get(this.url+'listar_producto_public_nuevos',{headers: headers});
  }

  listar_producto_public_masvendidos():Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json'});
    return this._http.get(this.url+'listar_producto_public_masvendidos',{headers: headers});
  }

  enviar_mensaje_contacto(data:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json'});
    return this._http.post(this.url+'enviar_mensaje_contacto',data,{headers: headers});
  }

  obtener_reviews_publico_producto(id:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type' : 'application/json'});
    return this._http.get(this.url+'obtener_reviews_publico_producto/'+id,{headers: headers});
  }
}
