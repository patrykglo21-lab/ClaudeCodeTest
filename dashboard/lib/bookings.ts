import { supabase } from './supabase';
import { DateRange, getDateRange } from './dateUtils';

export interface Booking {
  id: string;
  booking_date: string;
  customer_name: string;
  customer_phone: string;
  service: string;
  barber: string;
  price: number;
  after_hours: boolean;
}

export async function getBookings(range: DateRange): Promise<Booking[]> {
  const { start } = getDateRange(range);

  let query = supabase
    .from('bookings')
    .select('*')
    .order('booking_date', { ascending: false });

  if (start) {
    query = query.gte('booking_date', start.toISOString());
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}
