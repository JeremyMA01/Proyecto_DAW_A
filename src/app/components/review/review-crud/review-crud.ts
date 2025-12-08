import { Component } from '@angular/core';
import { ServReviewJson } from '../../../services/review/serv-review-json';
import { Router } from '@angular/router';
import { Review } from '../../../models/Review';

@Component({
  selector: 'app-review-crud',
  imports: [],
  templateUrl: './review-crud.html',
  styleUrl: './review-crud.css',
})
export class ReviewCrud {
  reviews:Review[] = []

  constructor(private servReview:ServReviewJson, private router:Router){

  }
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

}
