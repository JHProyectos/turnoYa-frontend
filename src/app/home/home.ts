import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../shared/materialModule';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  constructor(private router: Router) {}

  sections = [
    {
      title: 'Reservas',
      path: '/bookings',
      icon: 'event',
      description: 'Gestioná tus reservas y citas fácilmente.',
    },
    {
      title: 'Clientes',
      path: '/customers',
      icon: 'people',
      description: 'Administrá la información de tus clientes.',
    },
    {
      title: 'Servicios',
      path: '/services',
      icon: 'build',
      description: 'Definí y actualizá tus servicios disponibles.',
    },
  ];

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
