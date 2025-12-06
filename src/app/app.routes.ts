import { provideRouter, Routes } from '@angular/router';

import { HomeComponents } from './components/home-components/home-components';
import { BookList } from './components/books/book-list/book-list';
import { ReviewCrud } from './components/review/review-crud/review-crud';

import { LoginComponent } from './components/auth/login/login';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario';
import { CrudUsuariosComponent } from './components/crud-usuarios/crud-usuarios.component';
import { ReviewView } from './components/review/review-view/review-view';

export const routes: Routes = [
  // Página inicial
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login
  { path: 'login', component: LoginComponent },

  // Registro
  { path: 'registro', component: RegistroUsuarioComponent },

  // Home
  { path: 'home-components', component: HomeComponents },

  // Libros
  { path: 'book-list', component: BookList },
  /*{ path: 'resenas-view/:id', component: ReviewView},*/
  // Reseñas
  { path: 'resenas-view/:id', component: ReviewView },
  // CRUD Usuarios
  { path: 'usuarios', component: CrudUsuariosComponent },

  // Cualquier ruta rara → login
  { path: '**', redirectTo: 'login' }
];

export const appConfig = {
  providers: [
    provideRouter(routes)
  ]
};
