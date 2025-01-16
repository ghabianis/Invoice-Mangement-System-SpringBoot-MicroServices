import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client';
import { environment } from 'src/environments/environment';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/api/clients`;

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  getClients(filter?: string): Observable<Client[]> {
    if (environment.useMockData) {
      return this.mockDataService.getClients(filter);
    }
    let params = new HttpParams();
    if (filter) {
      params = params.set('search', filter);
    }
    return this.http.get<Client[]>(this.apiUrl, { params });
  }

  getClient(id: number): Observable<Client> {
    if (environment.useMockData) {
      return this.mockDataService.getClient(id) as Observable<Client>;
    }
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  createClient(client: Omit<Client, 'id'>): Observable<Client> {
    if (environment.useMockData) {
      return this.mockDataService.createClient(client);
    }
    return this.http.post<Client>(this.apiUrl, client);
  }

  updateClient(id: number, client: Partial<Client>): Observable<Client> {
    if (environment.useMockData) {
      return this.mockDataService.updateClient(id, client) as Observable<Client>;
    }
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: number): Observable<boolean> {
    if (environment.useMockData) {
      return this.mockDataService.deleteClient(id);
    }
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}