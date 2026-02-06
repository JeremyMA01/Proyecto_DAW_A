import { Component } from '@angular/core';
import { Book } from '../../../models/Book';
//import { ServBookJson } from '../../../services/serv-book-json';
import { ActivatedRoute } from '@angular/router';
import { Genre } from '../../../models/Genre';
import { NgIf } from '@angular/common';
import { ServBooksApi} from '../../../services/serv-books-api';

@Component({
  selector: 'app-book-view',
  imports: [NgIf],
  templateUrl: './book-view.html',
  styleUrl: './book-view.css',
})
export class BookView {

  book!:Book;
  generos : Genre[]=[];

  constructor(private servBook:ServBooksApi, private router:ActivatedRoute){


  }

  ngOnInit(){

    this.servBook.getGenre().subscribe((data:Genre[])=>{
      this.generos = data;
    });

    
    const id = this.router.snapshot.paramMap.get("id")
    
    this.servBook.getMovieById(Number(id)).subscribe(
      (dato:Book)=>{
        this.book = dato;
    
        } 

      );
  }

   volver(){
    history.back();
  }

  getgeneroName(idgenero: any):string{
    const genero = this.generos.find(g=> Number(g.id) === Number(idgenero) ); 
    return genero? genero.name :"Sin genero";
  }

}
