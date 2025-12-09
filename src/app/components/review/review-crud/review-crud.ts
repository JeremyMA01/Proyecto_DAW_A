import { Component, Input, ViewChild } from '@angular/core';
import { ServReviewJson } from '../../../services/review/serv-review-json';
import { Router } from '@angular/router';
import { Review } from '../../../models/Review';
import { ReusableTable } from '../../reusable_component/reusable-table/reusable-table';
import { ReusableReviewForm } from "../../reusable_component/reusable-review-form/reusable-review-form";

@Component({
  selector: 'app-review-crud',
  standalone: true,
  imports: [ReusableTable, ReusableReviewForm],
  templateUrl: './review-crud.html',
  styleUrl: './review-crud.css',
})
export class ReviewCrud {
  reviews:Review[] = []
  @Input() datos:any[] = [];

  @ViewChild('modalReview') modalReview!:ReusableReviewForm;

  columnas = [
    {key: 'id', label: 'ID'},
    {key: 'id_book', label: 'ID Libro'},
    {key: 'user', label: 'Usuario'},
    {key: 'score', label: 'Score'},
    {key: 'comment', label: 'Comentario'},
    {key: 'isRecommend', label: 'Recomendación'},
    {key: 'publishedDate', label: 'Fecha de Publicación'}
  ]

  constructor(private servReview:ServReviewJson, private router:Router){}

  ngOnInit(){
    this.loadReview();
  }

  loadReview():void{
    this.servReview.getReview().subscribe(
      (data:Review[])=>{
        this.reviews = data;
      }
    )
  }

  delete(review:Review):void{
    const confirmar = confirm('¿Estás seguro de eliminar la reseña?');
    if(confirmar != null){
      this.servReview.deleteReview(review.id!).subscribe(
        ()=>{
          alert('Reseña eliminada!');
          this.loadReview();
        }
      )
    }
  }

  loadReviewBook(id:number):void{
    this.servReview.getReviewIdBook(id).subscribe(
      (data:Review[])=>{
        this.reviews = data;
      }
    );
  }

  search(user:HTMLInputElement):void{
    const parametro = user.value.toLowerCase();
    this.servReview.searchReview(parametro).subscribe(
      (data:Review[])=>{
        this.reviews = data;
      });
  }

  save(review:Review){

    const reviewF:any = {
      ...review,
      id_book: review.id_book ? String(review.id_book) : undefined,
      id: review.id ? String(review.id) : undefined,
      score: Number(review.score),
      publishedDate: review.id ? review.publishedDate : new Date().toISOString()
    };

    if(reviewF.id){
      this.servReview.updateReview(reviewF).subscribe(
        ()=>{
          alert('Reseña Editada!');
          this.loadReview();
        });
    }else{
      reviewF.id = this.getId();
      this.servReview.addReview(reviewF).subscribe(
        ()=>{
          alert('Reseña Creada!');
          this.loadReview();
      });
    }
  }

  getId():string{
    if(this.reviews.length === 0) return "1";
      const id = this.reviews.map(r => Number(r.id) || 0);
      const stringId = Math.max(...id) + 1;
      return String(stringId);
  }

}
