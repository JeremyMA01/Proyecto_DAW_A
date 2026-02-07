import { Component } from '@angular/core';
import { Book } from '../../models/Book';
import { Genre } from '../../models/Genre';
import { ServBooksApi } from '../../services/serv-books-api';
import { CurrencyPipe,UpperCasePipe,DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ServHomeJson } from '../../services/home/serv-home-json';
@Component({
  selector: 'app-home-components',
  imports: [CurrencyPipe],
  templateUrl: './home-components.html',
  styleUrl: './home-components.css',
})
export class HomeComponents {
  books:Book[] = [];
  genre :Genre[] = [];

  
  constructor(private servBook:ServBooksApi, private servHome:ServHomeJson, private router:Router){}
  ngOnInit():void{

    this.loadBook();

     this.loadGenres();
  }
   loadBook():void{
    this.servBook.getBook().subscribe(
      (data:Book[])=>{
        this.books = data;
        console.log("Libros" + this.books[0].title);
      }
    );
   }

     loadGenres():void{
    this.servBook.getGenre().subscribe(
      (data:Genre[])=>{
        this.genre = data;
        console.log("Genero:" + this.genre[0].name);
      }
    );
     }

     getGenreName(genreId:number):string{
      const genre = this.genre.find((g)=> Number(g.id)===Number(genreId));
      return genre? genre.name:"sin genero";

     }

     activar(img:HTMLImageElement){
      img.classList.add("activa");

     }
       desactivar(img:HTMLImageElement){
      img.classList.remove("activa");

     }

    comprar(book:Book){
      this.servHome.comprar(book);
    }

    view(id:number):void{
      this.router.navigate(['/review-view, id']);
    }
}
