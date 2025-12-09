import { Component } from '@angular/core';
import { Book } from '../../../models/Book';
import { ServBookJson } from '../../../services/serv-book-json';
import { ActivatedRoute } from '@angular/router';
import { Genre } from '../../../models/Genre';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-book-view',
  imports: [NgIf],
  templateUrl: './book-view.html',
  styleUrl: './book-view.css',
})
export class BookView {

  book!:Book;
  generos : Genre[]=[];

  constructor(private servBook:ServBookJson, private router:ActivatedRoute){


  }

  ngOnInit(){

    this.servBook.getGenre().subscribe((data:Genre[])=>{
      this.generos = data;
    });

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

  getgeneroName(idgenero: any):string{
    const genero = this.generos.find(g=> Number(g.id) === Number(idgenero) ); 
    return genero? genero.name :"Sin genero";
  }

}
