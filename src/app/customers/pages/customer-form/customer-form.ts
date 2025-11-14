import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/materialModule';
import { Customer } from '../../shared/customer';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { last, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../shared/customer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-form',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.css',
})
export class CustomerForm {

  customerForm!: FormGroup;
  isEditMode = false;
  customerId: string | null = null;
  loading = false;
  error: string | null = null;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService) {

    this.customerForm = this.fb.group({
      id: [''],
      email: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      birth_date: [''],
      status: ['pending', Validators.required],
      role: ['customer', Validators.required],
      created_at: [''],
      updated_at: ['']
    });
  }

  get items() {
    return this.customerForm.get('items') as FormArray;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      id: [''],
      email: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      birth_date: [''],
      status: ['pending', Validators.required],
      role: ['customer', Validators.required],
      created_at: [''],
      updated_at: ['']
    });

    this.customerId = this.route.snapshot.paramMap.get('id');
    if (this.customerId === 'new') {
      this.customerId = null;
    }

    if (this.customerId) {
      this.isEditMode = true;
      this.loadCustomer(this.customerId);
    }
  }

  loadCustomer(id: string): void {
    this.loading = true;
    this.subscription.add(
      this.customerService.getCustomer(id).subscribe({
        next: (customer: Customer | null) => {
          if (!customer) { //si customer es null
            this.loading = false;
            return;
          }

          this.customerForm.patchValue({
            email: customer.email,
            first_name: customer.first_name,
            last_name: customer.last_name,
            password: customer.password,
            phone: customer.phone,
            birth_date: customer.birth_date ? customer.birth_date.split('T')[0]  : '',
            status: customer.status,
            role: customer.role
          });


          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Error cargando. Reintente.';
          this.loading = false;
        }
      })
    );
  }

  /* onSubmit(): void {
    if (this.isEditMode) {
      this.updateExistingCustomer();
    } else {
      this.createCustomer();
    }
  }*/



  onSubmit(): void {
    if (this.isEditMode) {
      this.updateExistingCustomer();
    } else {
      this.createCustomer();
    }
    if (this.customerForm.valid) {
      this.loading = true;
      this.error = null;
      const formValue = this.customerForm.value;
      const customerData = {
        ...formValue,
        customerData: formValue.customerData || {},
      };

      let request;

      if (this.isEditMode && this.customerId) {
        request = this.customerService.updateCustomer(this.customerId, customerData);
      } else {
        request = this.customerService.addCustomer(customerData as Omit<Customer, 'id'>);
      }

      this.subscription.add(
        request.subscribe({
          next: (customer) => {
            if (!customer) { //si customer es null
              this.loading = false;
              return;
            }
            this.loading = false;
            this.router.navigate(['/customers', customer.id]);
          },
          error: (err: any) => {
            this.error = `Error ${this.isEditMode ? 'updating' : 'adding'} customer. Please try again.`;
            this.loading = false;
          }
        })
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/customers']);
  }

  createCustomer(): void {
    if (this.customerForm.invalid) return;

    this.loading = true;
    const customerData = this.customerForm.value;

    this.subscription.add(
      this.customerService.addCustomer(customerData).subscribe({
        next: (customer) => {
          if (!customer) {
            this.loading = false;
            return;
          }
          this.loading = false;
          this.router.navigate(['/customers', customer.id]);
        },
        error: () => {
          this.error = 'Error creando cliente. Intenta nuevamente.';
          this.loading = false;
        }
      })
    );
  }


  updateExistingCustomer(): void {
    if (this.customerForm.invalid || !this.customerId) return;

    this.loading = true;
    const customerData = this.customerForm.value;

    this.subscription.add(
      this.customerService.updateCustomer(this.customerId, customerData).subscribe({
        next: (customer) => {
          if (!customer) {
            this.loading = false;
            return;
          }
          this.loading = false;
          this.router.navigate(['/customers', customer.id]);
        },
        error: () => {
          this.error = 'Error actualizando cliente. Intenta nuevamente.';
          this.loading = false;
        }
      })
    );
  }


  rejectCustomer(arg0: any) {
    throw new Error('Method not implemented.');
  }
  acceptCustomer(arg0: any) {
    throw new Error('Method not implemented.');
  }
}
