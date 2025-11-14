import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Booking } from './booking';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiBase = 'http://localhost:3000/api/bookings';

  constructor(private http: HttpClient) {}

  private normalizeBooking(b: any): Booking {
    return {
      ...b,
      id: b.id !== undefined && b.id !== null ? Number(b.id) : undefined
    } as Booking;
  }

  private normalizeBookingsArray(payload: any): Booking[] {
    const arr = Array.isArray(payload) ? payload : (payload?.data ?? []);
    return (arr ?? []).map((c: any) => this.normalizeBooking(c));
  }

  getBookings(): Observable<Booking[]> {
  return this.http.get<any>(this.apiBase).pipe(
    map(response => this.normalizeBookingsArray(response)),
    catchError(err => {
      console.error('[BookingService] getBookings error', err);
      return of([]);
    })
  );
}


  getBooking(id: number): Observable<Booking | null> {
    const url = `${this.apiBase}/${id}`;
    return this.http.get<any>(url).pipe(
      map(res => {
        const payload = res?.data ?? res;
        return payload ? this.normalizeBooking(payload) : null;
      }),
      catchError(err => {
        console.error('[BookingService] getBooking error', err);
        return of(null);
      })
    );
  }

  addBooking(booking: Omit<Booking, 'id'>): Observable<Booking | null> {
    const url = `${this.apiBase}`;
    return this.http.post<any>(url, booking).pipe(
      map(res => this.normalizeBooking(res?.data ?? res)),
      catchError(err => {
        console.error('[BookingService] addBooking error', err);
        return of(null);
      })
    );
  }

  updateBooking(id: number, booking: Partial<Booking>): Observable<Booking | null> {
    const url = `${this.apiBase}/${id}`;
    return this.http.put<any>(url, booking).pipe(
      map(res => this.normalizeBooking(res?.data ?? res)),
      catchError(err => {
        console.error('[BookingService] updateBooking error', err);
        return of(null);
      })
    );
  }

  deleteBooking(id: number): Observable<boolean> {
    const url = `${this.apiBase}/${id}`;
    return this.http.delete<void>(url).pipe(
      map(() => true),
      catchError(err => {
        console.error('[BookingService] deleteBooking error', err);
        return of(false);
      })
    );
  }
}
