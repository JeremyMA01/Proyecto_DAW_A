import { Component } from '@angular/core';
import { Book } from '../../../models/Book';
import { ServBookJson } from '../../../services/serv-book-json';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-view',
  imports: [],
  templateUrl: './book-view.html',
  styleUrl: './book-view.css',
})
export class BookView {

  book!:Book;

  constructor(private servBook:ServBookJson, private router:ActivatedRoute){


  }

  ngOnInit(){
    //obtenemos el id que llega 
    const id = this.router.snapshot.paramMap.get("id")
    //buscamos la pelicula q tiene el id por el servicio 
    this.servBook.getMovieById(Number(id)).subscribe(
      (dato:Book)=>{
        this.book = dato;//actualizamos el libro con el dato del servicio
    
        } 

      );
  }

   volver(){
    history.back();
  }

}
