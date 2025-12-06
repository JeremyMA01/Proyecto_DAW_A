import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../../models/Review';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServReviewJson {
    private reviewUrl = "http://localhost:3000/Review";

    constructor(private http:HttpClient){}

    addReview(review:Review):Observable<Review>{
      return this.http.post<Review>(this.reviewUrl, review);
    }

    updateReview(review:Review):Observable<Review>{
      const urlReviewUpdate= `${this.reviewUrl}/${review.id}`
      return this.http.put<Review>(urlReviewUpdate, review);
    }

    deleteReview(id:number):Observable<void>{
      const urlReviewDelete = `${this.reviewUrl}/${id}`;
      return this.http.delete<void>(urlReviewDelete);
    }

    searchReview(user:string):Observable<Review[]>{
      return this.http.get<Review[]>(this.reviewUrl).
        pipe(map((review)=>review.filter(r=>r.user.toLowerCase().
        includes(user.toLowerCase())))
      
    );
    }
    
    getReview():Observable<Review[]>{
      return this.http.get<Review[]>(this.reviewUrl);
    }

    getReviewIdBook(id:number):Observable<Review[]>{
      return this.http.get<Review[]>(this.reviewUrl).
      pipe(map((review)=>review.filter(r=>r.id_book === (id))));
    }
    /*
    getBookId(id:number):Observable<Book>{
      return this.http.get<book>(`${this.bookUrl}/${id}`)
    }
      */

}


