import 'zone.js';
import { Component, signal } from '@angular/core';

import { RouterOutlet, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

import { BookList } from "./components/books/book-list/book-list";
import { ReusableTable } from "./components/reusable_component/reusable-table/reusable-table";
import { HomeComponents } from "./components/home-components/home-components";
import { ReviewCrud } from './components/review/review-crud/review-crud';
import { ReviewView } from './components/review/review-view/review-view';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    RouterModule,
    BookList,
    ReusableTable,
    HomeComponents,
    ReviewCrud,
    ReviewView
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('PROYECTO_DAW_A');
}
