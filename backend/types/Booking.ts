export type Booking = {
  id?: number;
  user_id: number;
  car_id: number;
  start_datetime: string;
  end_datetime: string;
  total_price: number;
  pickupLocation: string;
  dropoffLocation: string;
};
