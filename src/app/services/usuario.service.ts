import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/Usuarios'; // OJO: Verifica si es "Usuario" o "Usuarios" en tu db.json

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // Obtener usuarios activos
  getUsuariosActivos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl)
      .pipe(map(usuarios => usuarios.filter(u => u.estadoActivo === true)));
  }

  // Buscar usuarios
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

  // Obtener usuario por ID
  getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  // Crear usuario
// En usuario.service.ts
crear(usuario: Usuario): Observable<Usuario> {
  console.log('URL de creación:', this.apiUrl);
  console.log('Datos a enviar:', usuario);
  return this.http.post<Usuario>(this.apiUrl, usuario);
}

  // Actualizar usuario
  actualizar(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${usuario.id}`, usuario);
  }

  // Eliminar usuario
  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Login
  login(email: string, password: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?email=${email}&password=${password}`)
      .pipe(
        map(usuarios => usuarios.length > 0 ? usuarios[0] : null)
      );
  }
}