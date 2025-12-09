import 'zone.js';
import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { BookList } from "./components/books/book-list/book-list";
import { ReusableTable } from "./components/reusable_component/reusable-table/reusable-table";
import { HomeComponents } from "./components/home-components/home-components";
import { DonacionesCrud } from './components/books/Donaciones-crud/donaciones-crud';
import { ReviewCrud } from './components/review/review-crud/review-crud';
import { ReviewView } from './components/review/review-view/review-view';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    DonacionesCrud,
    RouterLinkActive,
    RouterModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('PROYECTO_DAW_A');
  isAuthPage: boolean = false;
  private routerSubscription: Subscription = new Subscription();

  constructor(private router: Router) {}

  ngOnInit() {
    // Suscribirse a cambios de ruta
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        // Definir qué rutas NO deben mostrar el header
        const authRoutes = [
          '/login',
          '/registro',
          '/forgot-password',
          '/verificar-codigo',
          '/nueva-contrasena'
        ];
        
        // Verificar si la ruta actual está en la lista de authRoutes
        const currentUrl = event.urlAfterRedirects || event.url;
        this.isAuthPage = authRoutes.some(route => currentUrl.startsWith(route));
      });
  }
  irAUsuarios() {
    const userStr = localStorage.getItem('currentUser');
    
    if (userStr) {
      const user = JSON.parse(userStr);
      
      if (user.rol === 'administrador') {
        // SI ES ADMIN: Navega
        this.router.navigate(['/usuarios']);
      } else {
        // SI NO ES ADMIN: Muestra error
        alert('⛔ Acceso denegado: Solo los administradores pueden gestionar usuarios.');
      }
    } else {
      // SI NO ESTÁ LOGUEADO
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    // Limpiar suscripción para evitar memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
