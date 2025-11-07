import { Routes } from '@angular/router';
import { Bookings } from './bookings/bookings';
import { Customers } from './customers/customers';
import { Services } from './services/services';
import { Home } from './home/home';

import { Component } from '@angular/core';

export const routes: Routes = [
  { path: '', component: Home },  
  { path: 'bookings', component: Bookings },
  { path: 'customers', component: Customers },
  { path: 'services', component: Services },
 /* { path: 'booking/new', component: BookingFormComponent },
  { path: 'booking/:id', component: BookingDetailComponent },
  { path : 'booking/:id/edit', component: BookingFormComponent },
  { path: 'customer/new', component: CustomerFormComponent },
  { path: 'customer/:id', component: CustomerDetailComponent },
  { path : 'customer/:id/edit', component: CustomerFormComponent },
  { path: 'service/new', component: ServiceFormComponent },
  { path: 'service/:id', component: ServiceDetailComponent },
  { path : 'service/:id/edit', component: ServiceFormComponent },*/
  { path: '**', redirectTo: '' }
];
