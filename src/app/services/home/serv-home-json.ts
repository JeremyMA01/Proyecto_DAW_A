import { Injectable } from '@angular/core';
import { Book } from '../../models/Book';

@Injectable({
  providedIn: 'root',
})
export class ServHomeJson {

  comprar(book:Book){
    alert("Comprando libro: " + book.title + "");
  }
}
