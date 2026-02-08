import 'zone.js';
import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';


import { AuthService } from './services/services/auth.service';


import { DonacionesCrud } from './components/books/Donaciones-crud/donaciones-crud';

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

 
  constructor(
    public authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {
        const authRoutes = [
          '/login',
          '/registro',
          '/forgot-password',
          '/verificar-codigo',
          '/nueva-contrasena'
        ];
        
        const currentUrl = event.urlAfterRedirects || event.url;
        this.isAuthPage = authRoutes.some(route => currentUrl.startsWith(route));
      });
  }

  
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  
  irAUsuarios() {
    const user = this.authService.getCurrentUser();
    
    if (user) {
      if (user.rol === 'administrador') {
        this.router.navigate(['/usuarios']);
      } else {
        alert('Acceso denegado: Solo los administradores pueden gestionar usuarios.');
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}