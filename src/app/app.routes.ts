import { provideRouter, Routes } from '@angular/router';
import { BookList } from './components/books/book-list/book-list';
import { HomeComponents } from './components/home-components/home-components';
import { BookView } from './components/books/book-view/book-view';
import { CrudUsuariosComponent } from './components/crud-usuarios/crud-usuarios.component';
import { LoginComponent } from './components/auth/login/login';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario';

export const routes: Routes = [
  { path: 'home-components', component: HomeComponents }, 
  { path: 'book-list', component: BookList }, 
  { path: '', redirectTo: 'home-components', pathMatch: 'full' }, 
  {path: "book-view/:id", component: BookView},



  // Página inicial: LOGIN
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login
  { path: 'login', component: LoginComponent },

 
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
