import { provideRouter, Routes } from '@angular/router';
import { BookList } from './components/books/book-list/book-list';
import { HomeComponents } from './components/home-components/home-components';
import { CrudUsuariosComponent } from './components/crud-usuarios/crud-usuarios.component';
import { LoginComponent } from './components/auth/login/login';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario';

export const routes: Routes = [
  // Página inicial: LOGIN
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login
  { path: 'login', component: LoginComponent },

  // Home (después de iniciar sesión)
  { path: 'home-components', component: HomeComponents },

  // Listado de libros
  { path: 'book-list', component: BookList },
  //registro publico
  { path: 'registro', component: RegistroUsuarioComponent },

  // CRUD de usuarios (registro)
  { path: 'usuarios', component: CrudUsuariosComponent },

  // Cualquier ruta rara → vuelve al login
  { path: '**', redirectTo: 'login' }
];

export const appConfig = {
  providers: [
    provideRouter(routes)
  ]
};
