import { Component, ElementRef, numberAttribute, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, UpperCasePipe, DatePipe } from '@angular/common';

import { Review } from '../../../models/Review';
import { Book } from '../../../models/Book';

import { ServReviewJson } from '../../../services/review/serv-review-json';
import { ServBookJson } from '../../../services/serv-book-json';
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
    private servBook: ServBookJson,
    private servHome: ServHomeJson,
    private router: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentBookId = Number(this.router.snapshot.paramMap.get('id'));

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
      this.reviews = data;
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
    const reviewF: any = {
      ...review,
      id: review.id,
      id_book: Number(this.currentBookId),
      score: Number(review.score),
      publishedDate: review.id ? review.publishedDate
        : new Date().toISOString().substring(0, 10),
    };

    if (reviewF.id) {
      this.servReview.updateReview(reviewF).subscribe((data: Review) => {
        alert('Review Editada!');
        this.loadReviewByIdBook(this.currentBookId);
      });
    } else {
      this.servReview.addReview(reviewF).subscribe(() => {
        alert('Review Creada!');
        this.loadReviewByIdBook(this.currentBookId);
      });
    }
  }


  delete(review: Review) {
    const confirmar = confirm('¿Estás seguro de eliminar la reseña?');

    if (confirmar) {
      this.servReview.deleteReview(review.id!).subscribe(() => {
        alert('¡Eliminado exitosamente!');
        this.loadReviewByIdBook(this.currentBookId);
      });
    }
  }

  filterScore(score:number){
    if(this.totalOpiniones === 0){
      console.log('No hay opiniones para filtrar');
    }else{
      this.servReview.getScoreFilter(score).subscribe(
      )
    }
    this.servReview.getScoreFilter(score).subscribe((data:Review[])=>{
      this.reviews = data;
      this.calcularEstadistica();
    })
  }


  cargarReseñas(){
    return this.servReview.getReviews().subscribe(
      (data:Review[])=>{
        this.reviews = data;
      }
    )
  }

  eliminarReseñas(id:number){
    const confirmar = confirm('¿Estas seguro para eliminar?');
    this.servReview.deleteReview(id).subscribe(

      ()=>{
        console.log('Eliminado');
      }
    )
  }
}


