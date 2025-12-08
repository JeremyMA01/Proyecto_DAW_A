export interface Review{
    id?:number,
    id_book:number,
    user:string,
    score:number,
    comment:string,
    isRecommend?:boolean,
    publishedDate:Date | string;
}