import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, map, tap } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // El archivo está en: public/json/usuarios.json
  private readonly usuariosUrl = '/json/usuarios.json';

  // Lista de usuarios en memoria (cargados desde el JSON)
  private usuariosSubject = new BehaviorSubject<Usuario[] | null>(null);
  usuarios$ = this.usuariosSubject.asObservable();

  // Usuario actualmente logueado
  private usuarioActualSubject = new BehaviorSubject<Usuario | null>(null);
  usuarioActual$ = this.usuarioActualSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ==========================
  //  Carga inicial de usuarios
  // ==========================
  private cargarUsuarios(): Observable<Usuario[]> {
    const actual = this.usuariosSubject.value;
    if (actual) {
      // Ya están en memoria
      return of(actual);
    }

    // Primera vez: leer del JSON
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

  // ==========================
  //  CRUD en memoria
  // ==========================
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

  // ==========================
  //  LOGIN y usuario actual
  // ==========================

  /**
   * Intenta iniciar sesión con email y password.
   * Devuelve el usuario si coincide, o null si no existe.
   */
  login(email: string, password: string): Observable<Usuario | null> {
    return this.cargarUsuarios().pipe(
      map(lista => {
        const usuario = lista.find(
          u =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password &&
            u.estadoActivo !== false
        );
        return usuario ?? null;
      }),
      tap(usuario => {
        // Guardamos el usuario actual (puede ser null si falló el login)
        this.usuarioActualSubject.next(usuario);
      })
    );
  }

  logout(): void {
    this.usuarioActualSubject.next(null);
  }

  getUsuarioActualSnapshot(): Usuario | null {
    return this.usuarioActualSubject.value;
  }
}
