import { Genre } from "./Genre";

export interface Book{
    id:number,
    title:string,
    poster:string,
    author:string,
    budget:number,
    Estado: String,
    year:number,
    genreId:number,
    active:boolean,
    releaseDate:string,  
    genre?:Genre,
    categorie:string,
   
}