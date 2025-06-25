export interface ProductRating {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at?: string;
  updated_at?: string;
}
