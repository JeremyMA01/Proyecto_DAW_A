import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, firstValueFrom } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:3000/Usuarios';

  constructor(private http: HttpClient) {}

  // Obtener todos
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // Obtener "snapshot" compatible con ForgotPassword, Login, etc.
  async getUsuariosSnapshot(): Promise<Usuario[]> {
    return await firstValueFrom(this.http.get<Usuario[]>(this.apiUrl));
  }

  // Obtener solo activos
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

  // LOGIN (compatible con JSON Server)
  login(email: string, password: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?email=${email}&password=${password}`)
      .pipe(
        map(usuarios => usuarios.length > 0 ? usuarios[0] : null)
      );
  }
}
