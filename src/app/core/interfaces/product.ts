import { ProductFaq } from "./product-faq";
import { ProductRating } from "./product-rating";

export interface Product {
  id: string;
  title: string;
  description: string;
  image: File;
  price: number;
  video_ar: string;
  video_en: string;
  created_at?: Date;
  updated_at?: Date;
  product_faqs?: ProductFaq[];
  reviews?: ProductRating[];
}
