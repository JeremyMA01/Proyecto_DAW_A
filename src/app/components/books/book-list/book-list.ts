import { Component } from '@angular/core';
import { Book } from '../../../models/Book';
import { ServBookJson } from '../../../services/serv-book-json';
import { ReusableTable } from "../../reusable_component/reusable-table/reusable-table";

@Component({
  selector: 'app-book-list',
  imports: [ReusableTable],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList {
  books:Book[] = [];
  columnas = [
    {key: 'id', label: 'ID'},
    {key: 'title', label: 'Titulo'},
    {key: 'author', label: 'Autor'},
    {key: 'year', label: 'Año'},
    {key: 'genre', label: 'Genero'},
    {key: 'active', label: 'Estado'}

  ];

  constructor(private servBook:ServBookJson){}

  ngOnInit(){
    this.loadBook();
  }

  loadBook():void{
    this.servBook.getBook().subscribe(
      (data:Book[]) =>
      {
        this.books = data;
      }
    )
  }

}
