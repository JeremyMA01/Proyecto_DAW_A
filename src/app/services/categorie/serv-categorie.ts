import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Categorie } from '../../models/Categorie';

@Injectable({
  providedIn: 'root'
})
export class ServCategorie {

  private apiUrl = 'http://localhost:5005/api/Categories';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl);
  }

  getCategory(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}/${id}`);
  }

  addCategorie(categorie: Categorie): Observable<Categorie> {
    const { id, ...categorieWithoutId } = categorie;
    return this.http.post<Categorie>(this.apiUrl, categorieWithoutId);
  }

  updateCategorie(categorie: Categorie): Observable<any> {
    return this.http.put(`${this.apiUrl}/${categorie.id}`, categorie);
  }

  deleteCategorie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  activateCategorie(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/activate/${id}`, {});
  }

  getActiveCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/active`);
  }

  searchCategories(search: string): Observable<Categorie[]> {
    const params = new HttpParams().set('search', search);
    return this.http.get<Categorie[]>(`${this.apiUrl}/search`, { params });
  }

  deactivateCategory(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/deactivate/${id}`, {});
  }

  activateCategory(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/activate/${id}`, {});
  }
}