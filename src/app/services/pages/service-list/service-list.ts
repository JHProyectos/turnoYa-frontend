import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Service } from '../../shared/service.interface';
import { ServiceService } from '../../shared/service.service';
import { MaterialModule } from '../../../shared/materialModule';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './service-list.html',
  styleUrls: ['./service-list.css'],
})
export class ServiceList implements OnInit {

  displayedColumns: string[] = ['name', 'description', 'price', 'duration', 'actions'];
  dataSource: Service[] = [];
  loading = true;
  error: string | null = null;
  usingMock = false;

  // Mock data for UI testing
  private MOCK_SERVICES: Service[] = [
    { id: 1, name: 'Corte de pelo', description: 'Corte clásico', price: 15.0, duration: 30, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, name: 'Manicure', description: 'Manicure rápida', price: 20.0, duration: 45, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 3, name: 'Masaje', description: 'Masaje relajante 60min', price: 50.0, duration: 60, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ];

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(useMockIfEmpty = true): void {
    this.loading = true;
    this.error = null;
    this.usingMock = false;

    this.serviceService.getServices().subscribe({
      next: (data) => {
        const arr = Array.isArray(data) ? data : [];
        if (arr.length === 0 && useMockIfEmpty) {
          this.dataSource = this.MOCK_SERVICES;
          this.usingMock = true;
        } else {
          this.dataSource = arr;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading services', err);
        if (useMockIfEmpty) {
          this.dataSource = this.MOCK_SERVICES;
          this.usingMock = true;
        }
        this.error = 'Error al cargar los servicios.';
        this.loading = false;
      }
    });
  }

  deleteService(id: string): void {
    if (confirm('¿Seguro que querés eliminar este servicio?')) {
      this.loading = true;
      this.serviceService.deleteService(id).subscribe({
        next: () => {
          this.dataSource = this.dataSource.filter(s => String(s.id) !== String(id));
          this.loading = false;
        },
        error: (err) => {
          console.error('Error eliminando servicio', err);
          this.error = 'No se pudo eliminar el servicio.';
          this.loading = false;
        }
      });
    }
  }

}
