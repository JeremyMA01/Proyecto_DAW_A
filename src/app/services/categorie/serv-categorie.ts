import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Categorie } from '../../models/Categorie';

@Injectable({
  providedIn: 'root',
})
export class ServCategorie {

  private apiUrl = "http://localhost:3000/categories";

  constructor(private http: HttpClient) {}

  // Obtener todas las categorías
  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl).pipe(
      map(categories => 
        categories.map(cat => ({
          ...cat,
          // Si no tiene createdDate, asignar una fecha por defecto
          createdDate: cat.createdDate || this.getDefaultDate()
        }))
      )
    );
  }

  // Obtener categorías activas
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

  // Buscar categorías por nombre
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

  // Obtener categoría por ID
  getCategorieById(id: string): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}/${id}`).pipe(
      map(cat => ({
        ...cat,
        createdDate: cat.createdDate || this.getDefaultDate()
      }))
    );
  }

  // Registrar nueva categoría
  addCategorie(categorie: Categorie): Observable<Categorie> {
    // Asegurar que tenga createdDate
    const categorieWithDate = {
      ...categorie,
      createdDate: categorie.createdDate || this.getCurrentDate()
    };
    return this.http.post<Categorie>(this.apiUrl, categorieWithDate);
  }

  // Editar categoría
  updateCategorie(categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}/${categorie.id}`, categorie);
  }

  // Eliminar categoría
  deleteCategorie(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método helper para fecha por defecto
  private getDefaultDate(): string {
    // Fecha de hace un mes como valor por defecto para registros existentes
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  }

  // Método helper para fecha actual
  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}