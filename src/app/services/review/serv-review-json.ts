import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../../models/Review';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServReviewJson {

  private reviewUrl = "http://localhost:3000/Review";

  constructor(private http: HttpClient) {}

  addReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.reviewUrl, review);
  }

  updateReview(review: Review): Observable<Review> {
    const urlReviewUpdate = `${this.reviewUrl}/${review.id}`;
    return this.http.put<Review>(urlReviewUpdate, review);
  }

  deleteReview(id: number): Observable<void> {
    const urlReviewDelete = `${this.reviewUrl}/${id}`;
    return this.http.delete<void>(urlReviewDelete);
  }

  searchReview(user: string): Observable<Review[]> {
    const search = user.toLowerCase().trim();

    return this.http.get<Review[]>(this.reviewUrl).pipe(
      map((review) =>
        review.filter(r =>
          (r.user || '').toLowerCase().trim().includes(search)
        ))
    );
  }

  getReview(): Observable<Review[]> {
    return this.http.get<Review[]>(this.reviewUrl);
  }

  getReviewIdBook(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(this.reviewUrl).pipe(
      map((review) =>
        review.filter((r) => r.id_book === id)
      )
    );
  }

  searchReviewBook(user: string, id_book: number): Observable<Review[]> {
    const searchParam = user.toLowerCase().trim();

    return this.http.get<Review[]>(this.reviewUrl).pipe(
      map((reviews) =>
        reviews.filter((r) =>
          Number(r.id_book) === id_book &&
          (r.user || '').toLowerCase().includes(searchParam)
        )
      )
    );
  }

  getScoreFilter(score:number):Observable<Review[]>{
    return this.http.get<Review[]>(this.reviewUrl).pipe(
      map((reviews)=>
        reviews.filter((r)=>
        Number(r.score) === score)
      )
    )
  }

}
