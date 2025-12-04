import { provideRouter, Routes } from '@angular/router';
import { BookList } from './components/books/book-list/book-list';
import { HomeComponents } from './components/home-components/home-components';
import { ReviewCrud } from './components/review/review-crud/review-crud';

export const routes: Routes = [
  { path: 'home-components', component: HomeComponents }, 
  { path: 'book-list', component: BookList }, 
  { path: 'resenas', component: ReviewCrud},
  { path: '', redirectTo: 'home-components', pathMatch: 'full' }, 
];

export const appConfig = {
  providers: [
    provideRouter(routes)
  ]
};
