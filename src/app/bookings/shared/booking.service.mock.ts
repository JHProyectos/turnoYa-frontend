import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Booking } from './booking';

@Injectable({
  providedIn: 'root'
})
export class BookingServiceMock {
  private mockBookings: Booking[] = [
  {
    id: 1,
    client_id: 1,
    service_id: 1,
    booking_date: new Date('2024-07-01T10:00:00'),
    start_time: '10:00',
    end_time: '11:00',
    booking_status: 'confirmed',
    treatment_id: ['1', '2'],
    created_at: new Date('2024-06-20T09:00:00'),
    updated_at: new Date('2024-06-20T09:00:00')
  },
  {
    id: 2,
    client_id: 1,
    service_id: 2,
    booking_date: new Date('2024-07-05T10:00:00'),
    start_time: '12:00',
    end_time: '13:00',
    booking_status: 'pending',
    treatment_id: ['1', '2'],
    created_at: new Date('2024-06-01T09:00:00'),
    updated_at: new Date('2024-06-10T09:00:00')
  }
];

  getBookings(): Observable<Booking[]> {
    console.log('Cargando reservas... (mock)');
    return of(this.mockBookings).pipe(delay(500));
  }

  getBooking(id: number): Observable<Booking> {
    const booking = this.mockBookings.find(b => b.id === id)!;
    return of(booking).pipe(delay(300));
  }

  addBooking(booking: Omit<Booking, 'id'>): Observable<Booking> {
    const newBooking = { ...booking, id: Date.now() };
    this.mockBookings.push(newBooking);
    console.log('Reserva agregada (mock):', newBooking);
    return of(newBooking).pipe(delay(300));
  }

  updateBooking(id: number, booking: Partial<Booking>): Observable<Booking> {
    const index = this.mockBookings.findIndex(b => b.id === id);
    if (index >= 0) {
      this.mockBookings[index] = { ...this.mockBookings[index], ...booking };
    }
    console.log('Reserva actualizada (mock):', this.mockBookings[index]);
    return of(this.mockBookings[index]).pipe(delay(300));
  }

  deleteBooking(id: number): Observable<void> {
    this.mockBookings = this.mockBookings.filter(b => b.id !== id);
    console.log('Reserva eliminada (mock):', id);
    return of(void 0).pipe(delay(200));
  }
}
