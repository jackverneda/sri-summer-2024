export interface Product{
    title: string;
    description?: string[] | string ;
    rating_number: number;
    average_rating: number;
    price?: number;
    images: any[];
    parent_asin: string;
    details?: any;
  }