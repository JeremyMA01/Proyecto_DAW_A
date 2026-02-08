import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

// Importación de componentes
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
import { Categories } from './components/categories/categories';
import { DonacionesCrud } from './components/books/Donaciones-crud/donaciones-crud';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroUsuarioComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verificar-codigo', component: VerificarCodigoComponent },
  { path: 'nueva-contrasena', component: NuevaContrasenaComponent },

  
  { path: 'home-components', component: HomeComponents },
  { path: 'book-list', component: BookList },
  { path: 'book-view/:id', component: BookView },
  { path: 'review-view/:id', component: ReviewView },
  { path: 'review-crud', component: ReviewCrud },
  { path: 'categories', component: Categories },
  { path: 'donaciones-crud', component: DonacionesCrud },
  { path: 'mensajes', component: ContactMessageComponent },

  // 🛡️ GESTIÓN DE USUARIOS (Protegida: Solo Administrador)
  { 
    path: 'usuarios', 
    component: CrudUsuariosComponent, 
    canActivate: [adminGuard] 
  },

  
  { path: '**', redirectTo: 'login' }
];