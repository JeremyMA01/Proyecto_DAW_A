export interface Review{
    id?:number,
    id_user:number,
    id_book:number,
    user:string,
    score:number,
    comment:string,
    isRecommend?:boolean,
    publishedDate:string
}