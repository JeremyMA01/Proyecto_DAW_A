import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient) {}

 
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      email,
      password
    }).pipe(
      tap(response => {
       
        if (response?.token) {
          localStorage.setItem('token', response.token);

          
          const rawRol = response.rol || response.Rol || '';

          
          const userData = {
            email: email,
        
            rol: rawRol.toLowerCase().trim() 
          };

         
          localStorage.setItem('currentUser', JSON.stringify(userData));

          
          console.log('Sesión iniciada correctamente:', userData);
        }
      })
    );
  }


  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

 
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  
  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
}