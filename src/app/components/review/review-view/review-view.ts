import { Component, ElementRef, numberAttribute, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, UpperCasePipe, DatePipe } from '@angular/common';

import { Review } from '../../../models/Review';
import { Book } from '../../../models/Book';

import { ServBooksApi } from '../../../services/serv-books-api';
import { ServHomeJson } from '../../../services/home/serv-home-json';

import { ReusableReviewForm } from '../../reusable_component/reusable-review-form/reusable-review-form';
import { ServReviewApi } from '../../../services/review/serv-review-api';

@Component({
  selector: 'app-review-view',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, UpperCasePipe, ReusableReviewForm],
  templateUrl: './review-view.html',
  styleUrl: './review-view.css',
})
export class ReviewView implements OnInit {

  @ViewChild('searchIn') searchInput!: ElementRef;

  reviews: Review[] = [];
  book: Book | null = null;

  promedioGeneral: number = 0;
  totalOpiniones: number = 0;
  distribucion: any = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  currentBookId: number = 0;

  constructor(
    private servReview: ServReviewApi,
    private servBook: ServBooksApi,
    private servHome: ServHomeJson,
    private route: ActivatedRoute,
    private router:Router
  ) {}

  ngOnInit() {
    this.currentBookId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.currentBookId) {
      this.loadBookId(this.currentBookId);
      this.loadReviewByIdBook(this.currentBookId);
    }
  }

  calcularEstadistica() {
    if (this.reviews.length === 0) {
      this.totalOpiniones = 0;
      this.promedioGeneral = 0;
      this.distribucion = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      return;
    }

    this.totalOpiniones = this.reviews.length;

    let sumaTotalPuntos = 0;
    this.distribucion = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    this.reviews.forEach(r => {
      sumaTotalPuntos += r.score;
      if (this.distribucion[r.score] !== undefined) {
        this.distribucion[r.score]++;
      }
    });

    this.promedioGeneral = sumaTotalPuntos / this.totalOpiniones;
    this.promedioGeneral = parseFloat(this.promedioGeneral.toFixed(1));
  }

  getPorcentaje(estrellas: number): number {
    if (this.totalOpiniones === 0) return 0;
    return (this.distribucion[estrellas] / this.totalOpiniones) * 100;
  }

  getScore(score: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => (i < Math.round(score) ? 1 : 0));
  }

  getAvatarClass(name: string): string {
    if (!name) return '#ccc';

    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33A8', '#009688', '#FFC107'];
    const index = name.length % colors.length;

    return colors[index];
  }

  loadBookId(id: number): void {
    if (id !== 0) {
      this.servBook.getBookId(id).subscribe((data: Book) => {
        this.book = data;
      });
    }
  }

  loadReviewByIdBook(id: number): void {
    this.servReview.getReviewsBook(id).subscribe((data: Review[]) => {
      this.reviews = [...data];
      this.calcularEstadistica();
    });
  }

  comprar(book: Book) {
    this.servHome.comprar(book);
  }

  search(parametroRaw: string, id: number) {
    const parametro = parametroRaw.toLowerCase().trim();
    const bookId = Number(id);

    if (parametro === '') {
      this.loadReviewByIdBook(Number(id));
      return;
    }

    this.servReview.searchUserReview(parametro, bookId).subscribe((data:Review[])  => {
      this.reviews = data;
      this.calcularEstadistica();
    })
  }

 save(review: Review) {
  const reviewF: Review = { 
    id: review.id ? Number(review.id) : 0, 
    id_Book: Number(this.currentBookId), 
    user: review.user, 
    score: Number(review.score),
    comment: review.comment || '', 
    isRecommend: !!review.isRecommend, 
    publishedDate: new Date().toISOString()
  };
  
  if(reviewF.id_Book === 0){
    console.log("Error: id_Book no puede ser 0");
  }

  if(reviewF.id === 0){
    this.servReview.addReview(reviewF).subscribe(()=>{
      alert("¡Reseña publicada con éxito!");
      
      this.loadReviewByIdBook(this.currentBookId);
    })
  }else{
    this.servReview.updateReview(reviewF).subscribe(()=> 
      {
       alert("¡Reseña Actualiza!")
        this.loadReviewByIdBook(this.currentBookId);
      });
      
  }
}

  delete(review: Review) {
  const confirmar = confirm('¿Estás seguro de eliminar la reseña?');

  if (confirmar && review.id) {
    this.servReview.deleteReview(review.id).subscribe({
      next: () => {
        alert('¡Eliminado exitosamente!');
        this.reviews = this.reviews.filter(r => r.id !== review.id);
        this.calcularEstadistica();
        this.loadReviewByIdBook(this.currentBookId);
      },
      error: (err) => console.error("Error al eliminar de la DB:", err)
    });
  }
}

  filterScore(score:number){
    if(this.totalOpiniones === 0){
      console.log('No hay opiniones para filtrar');
      return;
    }
    this.servReview.getScoreFilter(score).subscribe((data:Review[])=>{
      this.reviews = data;
      this.calcularEstadistica();
    })
  }

}


