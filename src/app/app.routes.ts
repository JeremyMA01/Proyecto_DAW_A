import { provideRouter, Routes } from '@angular/router';
import { BookList } from './components/books/book-list/book-list';
import { HomeComponents } from './components/home-components/home-components';

export const routes: Routes = [
  { path: 'home-components', component: HomeComponents }, 
  { path: 'book-list', component: BookList }, 
  { path: '', redirectTo: 'home-components', pathMatch: 'full' }, 
];

export const appConfig = {
  providers: [
    provideRouter(routes)
  ]
};
