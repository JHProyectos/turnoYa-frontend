import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Customer } from './customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiBase = 'http://localhost:3000/api/customers';

  constructor(private http: HttpClient) {}

  // normaliza un customer convirtiendo id a string si existe
  private normalizeCustomer(c: any): Customer {
    return {
      ...c,
      id: c.id !== undefined && c.id !== null ? String(c.id) : undefined
    } as Customer;
  }

  // normaliza un array de customers
  private normalizeCustomersArray(payload: any): Customer[] {
    // backend puede devolver: array directo, o { data: array }
    const arr = Array.isArray(payload) ? payload : (payload?.data ?? []);
    return (arr ?? []).map((c: any) => this.normalizeCustomer(c));
  }

  // GET /api/customers/all
  getCustomers(): Observable<Customer[]> {
    const url = `${this.apiBase}/all`;
    return this.http.get<any>(url).pipe(
      map(response => this.normalizeCustomersArray(response)),
      catchError(err => {
        console.error('[CustomerService] getCustomers error', err);
        // no tirar error duro; devolvemos array vacío para que la UI lo maneje
        return of([]);
      })
    );
  }

  // GET /api/customers/:id  <-- si tu back no la expone, esto puede 404
  getCustomer(id: string): Observable<Customer | null> {
    const url = `${this.apiBase}/${id}`;
    return this.http.get<any>(url).pipe(
      map(res => {
        // si el back devuelve { data: customer } o customer directo
        const payload = res?.data ?? res;
        return payload ? this.normalizeCustomer(payload) : null;
      }),
      catchError(err => {
        console.error('[CustomerService] getCustomer error', err);
        return of(null);
      })
    );
  }

  // POST /api/customers (si tu back expone POST en otra ruta, ajustá)
  addCustomer(customer: Omit<Customer, 'id'>): Observable<Customer | null> {
    const url = `${this.apiBase}`;
    return this.http.post<any>(url, customer).pipe(
      map(res => this.normalizeCustomer(res?.data ?? res)),
      catchError(err => {
        console.error('[CustomerService] addCustomer error', err);
        return of(null);
      })
    );
  }

  // PUT /api/customers/:id
  updateCustomer(id: string, customer: Partial<Customer>): Observable<Customer | null> {
    const url = `${this.apiBase}/${id}`;
    return this.http.put<any>(url, customer).pipe(
      map(res => this.normalizeCustomer(res?.data ?? res)),
      catchError(err => {
        console.error('[CustomerService] updateCustomer error', err);
        return of(null);
      })
    );
  }

  // DELETE /api/customers/:id
  deleteCustomer(id: string): Observable<boolean> {
    const url = `${this.apiBase}/${id}`;
    return this.http.delete<void>(url).pipe(
      map(() => true),
      catchError(err => {
        console.error('[CustomerService] deleteCustomer error', err);
        // devolver false para que el caller sepa que falló
        return of(false);
      })
    );
  }

  /**
   * Nota sobre autenticación:
   * Si tus rutas están protegidas por authMiddleware (como en el back),
   * necesitás enviar el token en Authorization header. Ejemplo:
   *
   * const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
   * this.http.get(url, { headers })
   *
   * Podés adaptar los métodos arriba para inyectar headers si hace falta.
   */
}
