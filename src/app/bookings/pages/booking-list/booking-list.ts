import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/materialModule';
import { OnInit } from '@angular/core';
import { Booking } from '../../shared/booking';
import { BookingService } from '../../shared/booking.service';
import { BookingServiceMock } from '../../shared/booking.service.mock';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-list',
  imports: [MaterialModule, RouterModule, CommonModule],
  templateUrl: './booking-list.html',
  styleUrl: './booking-list.css',
})
export class BookingList implements OnInit {
  displayedColumns: string[] = ['client_id', 'service_id', 'booking_date', 'start_time', 'end_time', 'booking_status', 'treatment_id', 'created_at', 'updated_at', 'actions'];
  dataSource: Booking[] = [];
  loading = true;
  error: string | null = null;
  estados: ('confirmed' | 'cancelled' | 'completed' | 'pending')[] = [
    'confirmed',
    'cancelled',
    'completed',
    'pending'
  ];

  constructor(private bookingService: BookingServiceMock) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    console.log('Loading bookings...');
    this.bookingService.getBookings().subscribe({
      next: (data) => {
        console.log('Bookings received:', data);
        this.dataSource = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bookings', err);
        this.error = 'Error loading bookings. Please try again later.';
        this.dataSource = [];
        this.loading = false;
      }
    });
  }

  deleteBooking(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      this.loading = true;
      this.bookingService.deleteBooking(id).subscribe({
        next: () => {
          this.dataSource = this.dataSource.filter((booking: Booking) => booking.id !== id);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error deleting booking', err);
          this.error = 'Error al eliminar la reserva. Por favor, inténtalo de nuevo.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}

