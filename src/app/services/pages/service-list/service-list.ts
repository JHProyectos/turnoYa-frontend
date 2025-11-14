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

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.serviceService.getServices().subscribe({
      next: (data) => {
        this.dataSource = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading services', err);
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
