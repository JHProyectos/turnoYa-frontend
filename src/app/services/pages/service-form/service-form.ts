import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/materialModule';
import { Service } from '../../shared/service.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../shared/service.service';

@Component({
  selector: 'app-service-form',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './service-form.html',
  styleUrl: './service-form.css',
})
export class ServiceForm {
 
  serviceForm!: FormGroup;
  isEditMode = false;
  serviceId: string | null = null;
  loading = false;
  error: string | null = null;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService) {

    this.serviceForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      duration: ['', Validators.required],
      created_at: [''],
      updated_at: ['']
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      duration: ['', Validators.required],
      created_at: [''],
      updated_at: ['']
    });

    this.serviceId = this.route.snapshot.paramMap.get('id');
    if (this.serviceId === 'new') {
      this.serviceId = null;
    }

    if (this.serviceId) {
      this.isEditMode = true;
      this.loadService(this.serviceId);
    }
  }

  loadService(id: string): void {
    this.loading = true;
    this.subscription.add(
      this.serviceService.getService(id).subscribe({
        next: (service: Service | null) => {
          if (!service) {
            this.loading = false;
            return;
          }

          this.serviceForm.patchValue({
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration
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

  onSubmit(): void {
    if (this.serviceForm.valid) {
      this.loading = true;
      this.error = null;

      const formValue = this.serviceForm.value;
      const serviceData = {
        ...formValue,
        price: Number(formValue.price),
        duration: Number(formValue.duration)
      };

      let request;

      if (this.isEditMode && this.serviceId) {
        request = this.serviceService.updateService(this.serviceId, serviceData);
      } else {
        request = this.serviceService.addService(serviceData as Omit<Service, 'id'>);
      }

      this.subscription.add(
        request.subscribe({
          next: (service) => {
            if (!service) {
              this.loading = false;
              return;
            }
            this.loading = false;
            this.router.navigate(['/services', service.id]);
          },
          error: (err: any) => {
            this.error = `Error ${this.isEditMode ? 'updating' : 'adding'} service. Please try again.`;
            this.loading = false;
          }
        })
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/services']);
  }
}
