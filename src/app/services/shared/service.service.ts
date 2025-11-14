import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Service } from './service.interface';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private apiBase = 'http://localhost:3000/api/services';

  constructor(private http: HttpClient) {}

  private normalizeService(s: any): Service {
    return {
      id: s.id !== undefined && s.id !== null ? Number(s.id) : undefined,
      name: s.name || '',
      description: s.description || '',
      price: typeof s.price === 'string' ? parseFloat(s.price) : s.price || 0,
      duration: s.duration || s.duration || 0,
      created_at: s.created_at || new Date().toISOString(),
      updated_at: s.updated_at || new Date().toISOString(),
    } as Service;
  }

  private normalizeServicesArray(payload: any): Service[] {
    const arr = Array.isArray(payload) ? payload : payload?.data ?? [];
    return (arr ?? []).map((s: any) => this.normalizeService(s));
  }

  getServices() {
    const url = `${this.apiBase}`;
    return this.http.get<any>(url).pipe(
      map((response) => this.normalizeServicesArray(response)),
      catchError((err) => {
        console.error('[ServiceService] getServices error', err);
        return of([]);
      })
    );
  }
  
  addService(service: Omit<Service, 'id'>) {
    const url = `${this.apiBase}`;
    return this.http.post<any>(url, service).pipe(
      map((res) => {
        const payload = res?.data ?? res;
        return payload ? this.normalizeService(payload) : null;
      }),
      catchError((err) => {
        console.error('[ServiceService] addService error', err);
        return of(null);
      })
    );
  }

  getService(id: string) {
    const url = `${this.apiBase}/${id}`;
    return this.http.get<any>(url).pipe(
      map((res) => {
        const payload = res?.data ?? res;
        return payload ? this.normalizeService(payload) : null;
      }),
      catchError((err) => {
        console.error('[ServiceService] getService error', err);
        return of(null);
      })
    );
  }

  updateService(id: string, service: Partial<Omit<Service, 'id'>>) {
    const url = `${this.apiBase}/${id}`;
    return this.http.put<any>(url, service).pipe(
      map((res) => {
        const payload = res?.data ?? res;
        return payload ? this.normalizeService(payload) : null;
      }),
      catchError((err) => {
        console.error('[ServiceService] updateService error', err);
        return of(null);
      })
    );
  }

  deleteService(id: string): Observable<boolean> {
    const url = `${this.apiBase}/${id}`;
    return this.http.delete<any>(url).pipe(
      map(() => true),
      catchError((err) => {
        console.error('[ServiceService] deleteService error', err);
        return of(false);
      })
    );
  }
  
}
