import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/Usuarios'; 

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuariosActivos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl)
      .pipe(map(usuarios => usuarios.filter(u => u.active === true)));
  }

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

  getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }


crear(usuario: Usuario): Observable<Usuario> {
  console.log('URL de creación:', this.apiUrl);
  console.log('Datos a enviar:', usuario);
  return this.http.post<Usuario>(this.apiUrl, usuario);
}


  actualizar(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${usuario.id}`, usuario);
  }


  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  login(email: string, password: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?email=${email}&password=${password}`)
      .pipe(
        map(usuarios => usuarios.length > 0 ? usuarios[0] : null)
      );
  }
}