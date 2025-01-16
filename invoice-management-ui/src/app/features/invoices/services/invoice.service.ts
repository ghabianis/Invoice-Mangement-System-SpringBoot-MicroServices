import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Invoice } from '../../../core/models/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoices`;

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  getInvoices(filter?: { clientId?: number; status?: string; dateFrom?: string; dateTo?: string }): Observable<Invoice[]> {
    if (environment.useMockData) {
      return this.mockDataService.getInvoices(filter);
    }
    let params = new HttpParams();
    if (filter) {
      if (filter.clientId) {
        params = params.set('clientId', filter.clientId.toString());
      }
      if (filter.status) {
        params = params.set('status', filter.status);
      }
      if (filter.dateFrom) {
        params = params.set('dateFrom', filter.dateFrom);
      }
      if (filter.dateTo) {
        params = params.set('dateTo', filter.dateTo);
      }
    }
    return this.http.get<Invoice[]>(this.apiUrl, { params });
  }

  getInvoice(id: number): Observable<Invoice> {
    if (environment.useMockData) {
      return this.mockDataService.getInvoice(id) as Observable<Invoice>;
    }
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  createInvoice(invoice: Omit<Invoice, 'id'>): Observable<Invoice> {
    if (environment.useMockData) {
      return this.mockDataService.createInvoice(invoice);
    }
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  updateInvoice(id: number, invoice: Partial<Invoice>): Observable<Invoice> {
    if (environment.useMockData) {
      return this.mockDataService.updateInvoice(id, invoice) as Observable<Invoice>;
    }
    return this.http.put<Invoice>(`${this.apiUrl}/${id}`, invoice);
  }

  deleteInvoice(id: number): Observable<boolean> {
    if (environment.useMockData) {
      return this.mockDataService.deleteInvoice(id);
    }
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
