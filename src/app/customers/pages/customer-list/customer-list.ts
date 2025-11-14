import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Customer } from '../../shared/customer';
import { CustomerService } from '../../shared/customer.service';
import { MaterialModule } from '../../../shared/materialModule';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './customer-list.html',
  styleUrls: ['./customer-list.css'],
})
export class CustomerList implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'status', 'actions'];
  dataSource: Customer[] = [];
  loading = true;
  error: string | null = null;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.dataSource = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading customers', err);
        this.error = 'Error al cargar los clientes.';
        this.loading = false;
      }
    });
  }

  deleteCustomer(id: string): void {
    if (confirm('¿Seguro que querés eliminar este cliente?')) {
      this.loading = true;
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.dataSource = this.dataSource.filter(c => String(c.id) !== String(id));
          this.loading = false;
        },
        error: (err) => {
          console.error('Error eliminando cliente', err);
          this.error = 'No se pudo eliminar el cliente.';
          this.loading = false;
        }
      });
    }
  }
}
