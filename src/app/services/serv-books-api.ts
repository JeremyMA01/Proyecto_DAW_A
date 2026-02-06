import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Book } from '../models/Book';
import { Genre } from '../models/Genre';
@Injectable({
  providedIn: 'root',
})
export class ServBooksApi {
   private bookUrl  = "http://localhost:5005/api/Books";
    private genreUrl = "http://localhost:5005/api/Genres";
  
    constructor(private http: HttpClient) {}
  
    getBook(): Observable<Book[]> {
      return this.http.get<Book[]>(this.bookUrl);
    }
  
    getGenre(): Observable<Genre[]> {
      return this.http.get<Genre[]>(this.genreUrl);
    }
  
    getBooksActives(): Observable<Book[]> {
      return this.http.get<Book[]>(this.bookUrl).pipe(
        map((books) => books.filter((b) => b.active === true))
      );
    }
  
    getMovieById(id: number): Observable<Book> {
      const url = `${this.bookUrl}/${id}`;
      return this.http.get<Book>(url);
    }
  
    getid(id: number): Observable<Book> {
      const url = `${this.bookUrl}/${id}`;
      return this.http.get<Book>(url);
    }
  
    getBookId(id: number): Observable<Book> {
      const url = `${this.bookUrl}/${id}`;
      return this.http.get<Book>(url);
    }
  
    serchBook(title: string): Observable<Book[]> {
      return this.http.get<Book[]>(this.bookUrl).pipe(
        map((books) =>
          books.filter((b) =>
            b.title.toLowerCase().includes(title.toLowerCase())
          )
        )
      );
    }
  
    removeBook(id: number): Observable<void> {
      const urlBookEliminar = `${this.bookUrl}/${id}`;
      return this.http.delete<void>(urlBookEliminar);
    }
  
    updateBook(book: Book): Observable<Book> {
      const urlBookEditar = `${this.bookUrl}/${book.id}`;
      return this.http.put<Book>(urlBookEditar, book);
    }
  
    addBook(book: Book): Observable<Book> {
      return this.http.post<Book>(this.bookUrl, book);
    }
  }
  


