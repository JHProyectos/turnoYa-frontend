import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Booking } from './booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/all';

  constructor(private http: HttpClient) {}

  getBookings(): Observable<Booking[]> {
    return this.http.get<{data: Booking[]}>(this.apiUrl).pipe(
      map(response => {
        return response?.data || [];
      })
    );
  }

  getBooking(id: number): Observable<Booking> {
    return this.http.get<{data: Booking}>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  addBooking(booking: Omit<Booking, 'id'>): Observable<Booking> {
    return this.http.post<{data: Booking}>(this.apiUrl, booking).pipe(
      map(response => response.data)
    );
  }

  updateBooking(id: number, booking: Partial<Booking>): Observable<Booking> {
    return this.http.put<{data: Booking}>(`${this.apiUrl}/${id}`, booking).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
