export interface Booking {
  id?: number;
  client_id: number;
  service_id: number;
  booking_date: Date;
  start_time: string;
  end_time: string;
  booking_status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  treatment_id: string [];
  created_at: Date;
  updated_at: Date;
} 