import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Categorie } from '../../models/Categorie';

/*
@Injectable({
  providedIn: 'root',
})
export class ServCategorie {

  private apiUrl = "http://localhost:5005/api/Categories";

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl).pipe(
      map(categories => 
        categories.map(cat => ({
          ...cat,
          createdDate: cat.createdDate || this.getDefaultDate()
        }))
      )
    );
  }

  getCategoriesActivas(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl)
      .pipe(
        map(categories => 
          categories
            .filter(c => c.active === true)
            .map(cat => ({
              ...cat,
              createdDate: cat.createdDate || this.getDefaultDate()
            }))
        )
      );
  }

  searchCategories(nombre: string): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl)
      .pipe(
        map(categories => 
          categories
            .filter(c => c.name.toLowerCase().includes(nombre.toLowerCase()))
            .map(cat => ({
              ...cat,
              createdDate: cat.createdDate || this.getDefaultDate()
            }))
        )
      );
  }

  getCategorieById(id: string): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}/${id}`).pipe(
      map(cat => ({
        ...cat,
        createdDate: cat.createdDate || this.getDefaultDate()
      }))
    );
  }

  addCategorie(categorie: Categorie): Observable<Categorie> {
    const categorieWithDate = {
      ...categorie,
      createdDate: categorie.createdDate || this.getCurrentDate()
    };
    return this.http.post<Categorie>(this.apiUrl, categorieWithDate);
  }

  updateCategorie(categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}/${categorie.id}`, categorie);
  }

  deleteCategorie(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private getDefaultDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
  */

@Injectable({
  providedIn: 'root'
})
export class ServCategorie {
  // Cambia esta URL a la de tu API local
  private apiUrl = 'http://localhost:5005/api/Categories';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl);
  }

  getCategory(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}/${id}`);
  }

  addCategorie(categorie: Categorie): Observable<Categorie> {
    // IMPORTANTE: No envíes el ID si es auto-increment en la API
    const { id, ...categorieWithoutId } = categorie;
    return this.http.post<Categorie>(this.apiUrl, categorieWithoutId);
  }

  updateCategorie(categorie: Categorie): Observable<any> {
    return this.http.put(`${this.apiUrl}/${categorie.id}`, categorie);
  }

  deleteCategorie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchCategories(search: string): Observable<Categorie[]> {
    const params = new HttpParams().set('search', search);
    return this.http.get<Categorie[]>(`${this.apiUrl}/search`, { params });
  }

  // Métodos adicionales si los implementaste en el controlador
  deactivateCategory(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/deactivate/${id}`, {});
  }

  activateCategory(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/activate/${id}`, {});
  }
}