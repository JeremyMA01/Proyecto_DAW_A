import { Injectable } from '@angular/core';
import { Review } from '../../models/Review';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServReviewApi {
   private reviewUrl = "http://localhost:5005/api/Reviews";

  constructor(private http: HttpClient) {}

  /*
    Función: Cargar todas las reseñas en la tabla.
    Nota: Ya implementado en el Backend.
  */
  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.reviewUrl);
  }

  /*
  Función: Cargar todas las reseñas asociadas en un libro en la interfaz gráfica.
  Nota: Ya implementado en el Backend
  */
  getReviewsBook(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.reviewUrl}/Book/${id}`)
  }
  
  /*
  Función: Desconocida
  Nota: Se desconoce la utilidad de la función -- posible eliminación
  */
  getBookReview():Observable<Review[]>{
    return this.http.get<Review[]>(`${this.reviewUrl}`)
  }

  /*
  Función: Agregar las reseñas a la base de datos.
  Nota: Ya implementado en el Backend.
  */
  addReview(review: Review): Observable<Review> {

    return this.http.post<Review>(this.reviewUrl, review);
  }
  
  /*
  Función: Actualizar las reseñas en la base de datos.
  Nota: Ya implementado en el Backend.
  */
  updateReview(review: Review): Observable<Review> {
    const urlReviewUpdate = `${this.reviewUrl}/${review.id}`;
    return this.http.put<Review>(urlReviewUpdate, review);
  }

  /*
  Función: Eliminar las reseñas de la base de datos.
  Nota: Ya implementado en el backend.
  */
  deleteReview(id: number): Observable<void> {
    const urlReviewDelete = `${this.reviewUrl}/${id}`;
    return this.http.delete<void>(urlReviewDelete);
  } 

  /*
  Método BookReview -- Asociado al Home
  */

  /*
  Función: Buscar una reseña en la tabla mediante el nombre del usuario.
  Nota: Ya implementado en el backend.
  */
  searchReview(user: string): Observable<Review[]> {
    const search = user.toLowerCase().trim();

    return this.http.get<Review[]>(`${this.reviewUrl}/search/${search}`);
  }
  /*
  Función: Buscar la reseña de un usuario en especifico.
  Nota: Ya implementado en el backend.
  */
  searchUserReview(user:string, id_book:number):Observable<Review[]>{
    let params = new HttpParams()
      .set('user', user)
      .set('id_book', id_book.toString());
    return this.http.get<Review[]>(`${this.reviewUrl}/search`, {params})
  }
  /*
    Función: Filtrar las reseñas por puntuación en la tabla.
    Nota: Ya implementado en el Backend.
  */
  getScoreFilter(score:number):Observable<Review[]>{
    return this.http.get<Review[]>(`${this.reviewUrl}/search/${score}`)
  }

}
