export type Rating = {
  car_id: number;        
  user_id: number;       
  score: number;         
  comment?: string | null;
  created_at?: string;
};
