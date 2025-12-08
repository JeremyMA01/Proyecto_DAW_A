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


  // Obtener categorías activas
  getCategoriesActivas(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl)
      .pipe(map(
        (cat) => cat.filter(c => c.active === true)
      ));
  }

  // Buscar categorías por nombre
  searchCategories(nombre: string): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl)
      .pipe(map(
        (cat) => cat.filter(c => c.name.toLowerCase().includes(nombre.toLowerCase()))
      ));
  }

  // En serv-categorie.ts

// Obtener todas las categorías
getCategories(): Observable<Categorie[]> {
  return this.http.get<Categorie[]>(this.apiUrl);
}

// Obtener categoría por ID
getCategorieById(id: string): Observable<Categorie> {  // Cambiar a string
  return this.http.get<Categorie>(`${this.apiUrl}/${id}`);
}

// Registrar nueva categoría
addCategorie(categorie: Categorie): Observable<Categorie> {
  return this.http.post<Categorie>(this.apiUrl, categorie);
}

// Editar categoría
updateCategorie(categorie: Categorie): Observable<Categorie> {
  return this.http.put<Categorie>(`${this.apiUrl}/${categorie.id}`, categorie);
}

// Eliminar categoría
deleteCategorie(id: string): Observable<void> {  // Cambiar a string
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
}