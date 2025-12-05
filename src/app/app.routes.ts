import { provideRouter, Routes } from '@angular/router';

import { HomeComponents } from './components/home-components/home-components';
import { BookView } from './components/books/book-view/book-view';



import { BookList } from './components/books/book-list/book-list';
import { ReviewCrud } from './components/review/review-crud/review-crud';


import { LoginComponent } from './components/auth/login/login';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario';
import { CrudUsuariosComponent } from './components/crud-usuarios/crud-usuarios.component';

import { ContactMessageComponent } from './components/contact-messages/contact-message.component';


export const routes: Routes = [

  { path: 'home-components', component: HomeComponents }, 
  { path: 'book-list', component: BookList }, 
  { path: '', redirectTo: 'home-components', pathMatch: 'full' }, 
  {path: "book-view/:id", component: BookView},



  // Página inicial: LOGIN

  // Página inicial

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login
  { path: 'login', component: LoginComponent },


 
  //registro publico

  // Registro

  { path: 'registro', component: RegistroUsuarioComponent },

  // Home
  { path: 'home-components', component: HomeComponents },

  // Libros
  { path: 'book-list', component: BookList },

  // Reseñas
  { path: 'resenas', component: ReviewCrud },

  // CRUD Usuarios
  { path: 'usuarios', component: CrudUsuariosComponent },

  //Crud Mensajes, Sin dependencia de Usuario
  { path: 'mensajes', component: ContactMessageComponent },

  // Cualquier ruta rara → login
  { path: '**', redirectTo: 'login' }

];

export const appConfig = {
  providers: [
    provideRouter(routes)
  ]
};
