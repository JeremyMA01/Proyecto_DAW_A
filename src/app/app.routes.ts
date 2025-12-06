import { provideRouter, Routes } from '@angular/router';

import { HomeComponents } from './components/home-components/home-components';
import { BookView } from './components/books/book-view/book-view';
import { BookList } from './components/books/book-list/book-list';
import { ReviewCrud } from './components/review/review-crud/review-crud';
import { ReviewView } from './components/review/review-view/review-view';

import { LoginComponent } from './components/auth/login/login';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario';

import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password';
import { VerificarCodigoComponent } from './components/auth/verificar-codigo/verificar-codigo';
import { NuevaContrasenaComponent } from './components/auth/nueva-contrasena/nueva-contrasena.component';

import { CrudUsuariosComponent } from './components/crud-usuarios/crud-usuarios.component';
import { ContactMessageComponent } from './components/contact-messages/contact-message.component';



export const routes: Routes = [

  // Página inicial: LOGIN
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login
  { path: 'login', component: LoginComponent },

  // Registro público
  { path: 'registro', component: RegistroUsuarioComponent },

  // Recuperación de contraseña
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verificar-codigo', component: VerificarCodigoComponent },
  { path: 'nueva-contrasena', component: NuevaContrasenaComponent },

  // Home
  { path: 'home-components', component: HomeComponents },

  // Libros
  { path: 'book-list', component: BookList },
  { path: 'book-view/:id', component: BookView },

  // Reseñas
  { path: 'resenas-view/:id', component: ReviewView },
  { path: 'resenas-crud', component: ReviewCrud },

  // CRUD Usuarios
  { path: 'usuarios', component: CrudUsuariosComponent },

  // CRUD Mensajes
  { path: 'mensajes', component: ContactMessageComponent },

  // Cualquier ruta rara → login
  { path: '**', redirectTo: 'login' }
];

export const appConfig = {
  providers: [
    provideRouter(routes)
  ]
};
