import { provideRouter, Routes } from '@angular/router';
import { BookList } from './components/books/book-list/book-list';

export const routes: Routes = [
  { path: 'book-list', component: BookList }, 
  { path: '', redirectTo: 'book-list', pathMatch: 'full' }, 
];

export const appConfig = {
  providers: [
    provideRouter(routes)
  ]
};
