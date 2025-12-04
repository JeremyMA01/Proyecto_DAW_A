export interface Review{
    id?:number,
    user:string,
    score:number,
    comment:string,
    isRecommend?:boolean,
    publishedDate:Date
}