import { Component } from '@angular/core';
import { Book } from '../../../models/Book';
import { ServBookJson } from '../../../services/serv-book-json';
import { ReusableTable } from "../../reusable_component/reusable-table/reusable-table";
import { DialogConfirm } from '../../dialog/dialog-confirm/dialog-confirm';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-book-list',
  standalone :true,
  imports: [ReusableTable, DialogConfirm],
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
    {key: 'active', label: 'Estado'},
    {key: 'action', label: 'Acciones'},
    

    
  ];

  seleccioandorEliminar:Book | null = null;


  dialogVisible: boolean = false;

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

  cerrarDialogo(){
    this.dialogVisible= false;
  }

  abrirDialogo(){
    this.dialogVisible = true; 
  }




}
