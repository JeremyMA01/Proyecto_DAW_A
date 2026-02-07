import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = `${environment.apiUrl}/Usuarios`;

  constructor(private http: HttpClient) {}

  // ===== LISTAR =====
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // ===== BUSCAR =====
  searchUsuarios(parametro: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?search=${parametro}`);
  }

  // ===== CREAR =====
  crear(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  // ===== ACTUALIZAR =====
  actualizar(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${usuario.id}`, usuario);
  }

  // ===== ELIMINAR =====
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ===== LOGIN =====
  login(email: string, password: string): Observable<Usuario> {
    return this.http.get<Usuario>(
      `${this.apiUrl}/login?email=${email}&password=${password}`
    );
  }
}
