import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Book } from '../models/Book';
import { Genre } from '../models/Genre';

@Injectable({
  providedIn: 'root',
})
export class ServBookJson {
  private bookUrl = "http://localhost:3000/Libros";
  private GenreUrl = "http://localhost:3000/Generos";

  constructor(private http:HttpClient){}

  getBook():Observable<Book[]>{
    return this.http.get<Book[]>(this.bookUrl);
  }
  
  getGenre():Observable<Genre[]>{
    return this.http.get<Genre[]>(this.GenreUrl);
  }

  getBooksActives():Observable<Book[]>{
    return this.http.get<Book[]>(this.bookUrl)
    .pipe(map(
    (books)=>books.filter(b=>b.active === true)
    ));
  }

  getBookId(id:number):Observable<Book>{
    return this.http.get<Book>(`${this.bookUrl}/${id}`);
  }
}

