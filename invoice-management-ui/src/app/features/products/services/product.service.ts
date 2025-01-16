import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Product } from '../../../core/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  getProducts(filter?: string): Observable<Product[]> {
    if (environment.useMockData) {
      return this.mockDataService.getProducts(filter);
    }
    let params = new HttpParams();
    if (filter) {
      params = params.set('search', filter);
    }
    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  getProduct(id: number): Observable<Product> {
    if (environment.useMockData) {
      return this.mockDataService.getProduct(id) as Observable<Product>;
    }
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    if (environment.useMockData) {
      return this.mockDataService.createProduct(product);
    }
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    if (environment.useMockData) {
      return this.mockDataService.updateProduct(id, product) as Observable<Product>;
    }
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<boolean> {
    if (environment.useMockData) {
      return this.mockDataService.deleteProduct(id);
    }
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
