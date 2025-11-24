import 'zone.js';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookList } from "./components/books/book-list/book-list";
import { ReusableTable } from "./components/reusable_component/reusable-table/reusable-table";

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, BookList, ReusableTable],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('PROYECTO_DAW_A');
}
