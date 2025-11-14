import { Routes } from '@angular/router';

import { CustomerList } from './customers/pages/customer-list/customer-list';
import { CustomerForm } from './customers/pages/customer-form/customer-form';
import { CustomerDetail } from './customers/pages/customer-detail/customer-detail';
import { BookingList } from './bookings/pages/booking-list/booking-list';
import { BookingForm } from './bookings/pages/booking-form/booking-form';
import { BookingDetail } from './bookings/pages/booking-detail/booking-detail';
import { ServiceList } from './services/pages/service-list/service-list';
import { ServiceForm } from './services/pages/service-form/service-form';
import { ServiceDetail } from './services/pages/service-detail/service-detail';
import { Home } from './home/home';
import { Component } from '@angular/core';
import { App } from './app';

export const routes: Routes = [
  { path: '', component: Home },  
  { path: 'bookings', component: BookingList },

  { path: 'customers', component: CustomerList },
  { path: 'bookings/new', component: BookingForm },
  { path: 'bookings/:id', component: BookingDetail },
  { path: 'bookings/:id/edit', component: BookingForm },
  { path: 'customers/new', component: CustomerForm },
  { path: 'customers/new',  component: CustomerForm },
  { path: 'customers/:id', component: CustomerDetail },
  { path: 'customers/:id/edit', component: CustomerForm },
  { path: 'services', component: ServiceList },
  { path: 'services/new', component: ServiceForm },
  { path: 'services/:id', component: ServiceDetail },
  { path: 'services/:id/edit', component: ServiceForm },
  { path: '**', redirectTo: '' }
];
