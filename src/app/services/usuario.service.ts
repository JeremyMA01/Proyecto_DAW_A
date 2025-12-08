import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, firstValueFrom, switchMap } from 'rxjs';
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

  
  async getUsuariosSnapshot(): Promise<Usuario[]> {
    return await firstValueFrom(this.http.get<Usuario[]>(this.apiUrl));
  }

 
  getUsuariosActivos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl)
      .pipe(map(usuarios => usuarios.filter(u => u.estadoActivo === true)));
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


  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }


  crear(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    return this.getUsuarios().pipe(
      switchMap(usuarios => {
      
        const maxId = usuarios.reduce((max, user) => {
          return Number(user.id) > max ? Number(user.id) : max;
        }, 0);

        
        const nuevoId = maxId + 1;

        
        const usuarioConId = { ...usuario, id: nuevoId };

   
        return this.http.post<Usuario>(this.apiUrl, usuarioConId);
      })
    );
  }

  // Editar
  actualizar(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${usuario.id}`, usuario);
  }

  // Eliminar
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  
  login(email: string, password: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?email=${email}&password=${password}`)
      .pipe(
        map(usuarios => usuarios.length > 0 ? usuarios[0] : null)
      );
  }
}