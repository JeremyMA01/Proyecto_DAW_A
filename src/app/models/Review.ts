export interface Review {
    id?: number;          
    id_Book: number;     
    user: string;        
    score: number;       
    comment: string;      
    isRecommend?: boolean;
    publishedDate: string | Date; 
}