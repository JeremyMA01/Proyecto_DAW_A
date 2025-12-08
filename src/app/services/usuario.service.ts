import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  // Obtener todos
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // Obtener solo activos (si quieres)
  getUsuariosActivos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl)
      .pipe(map(usuarios => usuarios.filter(u => u.estadoActivo === true)));
  }

  // Buscar (nombre, email, ciudad)
  searchUsuarios(txt: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl)
      .pipe(
        map(usuarios =>
          usuarios.filter(u =>
            u.nombre.toLowerCase().includes(txt.toLowerCase()) ||
            u.email.toLowerCase().includes(txt.toLowerCase()) ||
            u.ciudad.toLowerCase().includes(txt.toLowerCase())
          )
        )
      );
  }

  // Buscar por id
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  // Crear
  crear(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  // Editar
  actualizar(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${usuario.id}`, usuario);
  }

  // Eliminar
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
