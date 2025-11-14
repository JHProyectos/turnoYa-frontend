import { Component, OnInit, OnDestroy } from '@angular/core';
import { MaterialModule } from '../../../shared/materialModule';
import { Subscription } from 'rxjs';
import { BookingService } from '../../shared/booking.service';
import { Booking } from '../../shared/booking';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule, DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-booking-detail',
  imports: [MaterialModule, RouterModule, TitleCasePipe, UpperCasePipe, DatePipe, CommonModule],
  templateUrl: './booking-detail.html',
  styleUrl: './booking-detail.css',
})
export class BookingDetail implements OnInit, OnDestroy{
  booking: Booking | null = null;
  loading = true;
  error: string | null = null
  private subscription: Subscription = new Subscription();
  dataSource: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
    this.loadBooking(Number(id));
    }
  }

  loadBooking(id: number): void {
    this.loading = true;
    this.subscription.add(
      this.bookingService.getBooking(id).subscribe({
        next: (data: Booking | null) => {
          this.booking = data;
          this.loading = false;
        },
         error: (err: any) => {
          this.error = 'Error al cargar la reserva. Por favor, inténtalo de nuevo.';
          this.loading = false;
        },
        complete: () => {
        }
      })
    );
  }

  deleteBooking(id: number): void {
    if (confirm('¿Seguro que querés eliminar esta reserva?')) {
      this.loading = true;
      this.bookingService.deleteBooking(id).subscribe({
        next: () => {
          this.dataSource = this.dataSource.filter((b: { id: any; }) => Number(b.id) !== Number(id));
          this.loading = false;
        },
        error: (err) => {
          console.error('Error eliminando la reserva', err);
          this.error = 'No se pudo eliminar la reserva.';
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/bookings']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
