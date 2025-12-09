import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, UpperCasePipe, DatePipe } from '@angular/common';
import { Review } from '../../../models/Review';
import { Book } from '../../../models/Book';
import { ServReviewJson } from '../../../services/review/serv-review-json';
import { ServBookJson } from '../../../services/serv-book-json';
import { ServHomeJson } from '../../../services/home/serv-home-json';
import { ReusableReviewForm } from '../../reusable_component/reusable-review-form/reusable-review-form';

@Component({
  selector: 'app-review-view',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, UpperCasePipe, ReusableReviewForm],
  templateUrl: './review-view.html',
  styleUrl: './review-view.css',
})

export class ReviewView implements OnInit{
  reviews: Review[] = [];
  book: Book | null = null;

  promedioGeneral: number = 0;
  totalOpiniones: number = 0;
  distribucion: any = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  currentBookId: number = 0;
  
  constructor(private servReview: ServReviewJson, private servBook: ServBookJson, private servHome: ServHomeJson, private router: ActivatedRoute){} 
    

  ngOnInit() {
    this.currentBookId = Number(this.router.snapshot.paramMap.get("id"));

    if (this.currentBookId) {
      this.loadBookId(this.currentBookId);
      this.loadReviewBook(this.currentBookId);
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
    const cantidad = this.distribucion[estrellas];
    return (cantidad / this.totalOpiniones) * 100;
  }

  getScore(score: number): number[] {
    return Array(5).fill(0).map((_, i) => (i < Math.round(score) ? 1 : 0));
  }

  getAvatarClass(name: string): string {
    if (!name) return '#ccc';
    let colors = ['#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33A8', '#009688', '#FFC107'];
    let index = name.length % colors.length;
    return colors[index];
  }

  loadBookId(id: number): void {
    if (id != 0) {
      this.servBook.getBookId(id).subscribe((data: Book) => {
        this.book = data;
      });
    }
  }

  loadReviewBook(id: number): void {
    this.servReview.getReviewIdBook(id).subscribe((data: Review[]) => {
      this.reviews = data;
      this.calcularEstadistica();
    });
  }
  
  comprar(book: Book) {
    this.servHome.comprar(book);
  }

  search(user: HTMLInputElement) {
    let parametro = user.value.toLowerCase();
    this.servReview.searchReview(parametro).subscribe((data: Review[]) => {
      this.reviews = data;
    });
  }
  
   save(review:Review){
    
    const reviewF: any = {
      ...review,
      id_book: this.currentBookId, 
      score: Number(review.score),
      id: review.id ? String(review.id) : undefined, 
      publishedDate: review.id ? review.publishedDate : new Date().toISOString()
    };   

   if(reviewF.id){

      this.servReview.updateReview(reviewF).subscribe(
        (data:Review)=>{
          alert('Review Editada!');
          this.loadReviewBook(this.currentBookId);
        });
    }else{ 

      reviewF.id = this.getId();
      
      this.servReview.addReview(reviewF).subscribe(
        ()=>{
          alert('Review Creada!');
          this.loadReviewBook(this.currentBookId);
        }
      );
    }
  }

  getId():string{
    if(this.reviews.length === 0) return "1";
      const id = this.reviews.map(r => Number(r.id) || 0);
      const stringId = Math.max(...id) + 1;
      return String(stringId);
    }
  

  delete(review: Review) {
    const confirmar = confirm('¿Estás seguro de eliminar la reseña?');
    if (confirmar) {
      this.servReview.deleteReview(review.id!).subscribe(() => {
        alert("¡Eliminado exitosamente!");
        this.loadReviewBook(this.currentBookId);
      });
    }
  }
}