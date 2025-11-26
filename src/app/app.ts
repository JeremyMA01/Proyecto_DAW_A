import 'zone.js';
import { Component, signal } from '@angular/core';
import { RouterOutlet ,RouterLinkActive, RouterLink, RouterModule} from '@angular/router';
import { BookList } from "./components/books/book-list/book-list";
import { ReusableTable } from "./components/reusable_component/reusable-table/reusable-table";
import { HomeComponents } from "./components/home-components/home-components";

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, BookList, ReusableTable, HomeComponents,RouterLinkActive, RouterLink, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('PROYECTO_DAW_A');
}
