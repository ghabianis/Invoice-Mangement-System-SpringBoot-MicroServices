import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Client } from '../models/client';
import { Product } from '../models/product';
import { Invoice } from '../models/invoice';
import { MOCK_CLIENTS } from '../mock-data/clients.mock';
import { MOCK_PRODUCTS } from '../mock-data/products.mock';
import { MOCK_INVOICES } from '../mock-data/invoices.mock';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private clients = [...MOCK_CLIENTS];
  private products = [...MOCK_PRODUCTS];
  private invoices = [...MOCK_INVOICES];

  // Client Methods
  getClients(filter?: string): Observable<Client[]> {
    let filteredClients = [...this.clients];
    if (filter) {
      const searchTerm = filter.toLowerCase();
      filteredClients = filteredClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        client.company?.toLowerCase().includes(searchTerm)
      );
    }
    return of(filteredClients);
  }

  getClient(id: number): Observable<Client | undefined> {
    return of(this.clients.find(client => client.id === id));
  }

  createClient(client: Omit<Client, 'id'>): Observable<Client> {
    const newClient = {
      ...client,
      id: Math.max(...this.clients.map(c => c.id)) + 1
    };
    this.clients.push(newClient);
    return of(newClient);
  }

  updateClient(id: number, client: Partial<Client>): Observable<Client | undefined> {
    const index = this.clients.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clients[index] = { ...this.clients[index], ...client };
      return of(this.clients[index]);
    }
    return of(undefined);
  }

  deleteClient(id: number): Observable<boolean> {
    const index = this.clients.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clients.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  // Product Methods
  getProducts(filter?: string): Observable<Product[]> {
    let filteredProducts = [...this.products];
    if (filter) {
      const searchTerm = filter.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }
    return of(filteredProducts);
  }

  getProduct(id: number): Observable<Product | undefined> {
    return of(this.products.find(product => product.id === id));
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    const newProduct = {
      ...product,
      id: Math.max(...this.products.map(p => p.id)) + 1
    };
    this.products.push(newProduct);
    return of(newProduct);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product | undefined> {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...product };
      return of(this.products[index]);
    }
    return of(undefined);
  }

  deleteProduct(id: number): Observable<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  // Invoice Methods
  getInvoices(filter?: { clientId?: number; status?: string; dateFrom?: string; dateTo?: string }): Observable<Invoice[]> {
    let filteredInvoices = [...this.invoices];
    if (filter) {
      if (filter.clientId) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.clientId === filter.clientId);
      }
      if (filter.status) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.status === filter.status);
      }
      if (filter.dateFrom && filter.dateFrom.trim()) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.date >= filter.dateFrom!);
      }
      if (filter.dateTo && filter.dateTo.trim()) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.date <= filter.dateTo!);
      }
    }
    return of(filteredInvoices);
  }

  getInvoice(id: number): Observable<Invoice | undefined> {
    return of(this.invoices.find(invoice => invoice.id === id));
  }

  createInvoice(invoice: Omit<Invoice, 'id'>): Observable<Invoice> {
    const newInvoice = {
      ...invoice,
      id: Math.max(...this.invoices.map(i => i.id)) + 1
    };
    this.invoices.push(newInvoice);
    return of(newInvoice);
  }

  updateInvoice(id: number, invoice: Partial<Invoice>): Observable<Invoice | undefined> {
    const index = this.invoices.findIndex(i => i.id === id);
    if (index !== -1) {
      this.invoices[index] = { ...this.invoices[index], ...invoice };
      return of(this.invoices[index]);
    }
    return of(undefined);
  }

  deleteInvoice(id: number): Observable<boolean> {
    const index = this.invoices.findIndex(i => i.id === id);
    if (index !== -1) {
      this.invoices.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
