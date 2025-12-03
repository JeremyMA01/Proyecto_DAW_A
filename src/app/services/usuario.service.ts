import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly usuariosUrl = '/json/usuarios.json';

  private usuariosSubject = new BehaviorSubject<Usuario[] | null>(null);
  usuarios$ = this.usuariosSubject.asObservable();

  constructor(private http: HttpClient) {}

  private cargarUsuarios(): Observable<Usuario[]> {
    const actual = this.usuariosSubject.value;
    if (actual) {
      return of(actual);
    }

    return this.http.get<Usuario[]>(this.usuariosUrl).pipe(
      map(lista => {
        this.usuariosSubject.next(lista);
        return lista;
      })
    );
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.cargarUsuarios();
  }

  getUsuariosSnapshot(): Usuario[] {
    return this.usuariosSubject.value ?? [];
  }

  crear(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    const lista = this.getUsuariosSnapshot();
    const nuevoId = lista.length ? Math.max(...lista.map(u => u.id)) + 1 : 1;
    const nuevoUsuario: Usuario = { ...usuario, id: nuevoId };
    this.usuariosSubject.next([...lista, nuevoUsuario]);
    return of(nuevoUsuario);
  }

  actualizar(usuario: Usuario): Observable<Usuario> {
    const lista = this.getUsuariosSnapshot();
    const idx = lista.findIndex(u => u.id === usuario.id);
    if (idx !== -1) {
      const copia = [...lista];
      copia[idx] = { ...usuario };
      this.usuariosSubject.next(copia);
    }
    return of(usuario);
  }

  eliminar(id: number): Observable<void> {
    const lista = this.getUsuariosSnapshot();
    this.usuariosSubject.next(lista.filter(u => u.id !== id));
    return of(void 0);
  }
}
