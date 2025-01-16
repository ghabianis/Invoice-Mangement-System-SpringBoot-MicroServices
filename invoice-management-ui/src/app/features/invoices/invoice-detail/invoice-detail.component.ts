import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { InvoiceService } from '../services/invoice.service';
import { Invoice } from '../../../core/models/invoice';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invoice-detail',
  template: `
    <div class="invoice-detail-container" *ngIf="invoice">
      <div class="mat-elevation-z2">
        <div class="mat-headline-5 p-4">
          Invoice #{{invoice?.id}}
          <div class="mat-subtitle-1">{{invoice?.date | date}}</div>
        </div>

        <div class="p-4">
          <div class="info-section">
            <div class="info-row">
              <strong>Client:</strong>
              <span>{{invoice?.clientName}}</span>
            </div>
            <div class="info-row">
              <strong>Status:</strong>
              <span>{{invoice?.status}}</span>
            </div>
          </div>

          <div class="items-section">
            <h3>Items</h3>
            <table mat-table [dataSource]="invoice?.items || []">
              <!-- Product Name Column -->
              <ng-container matColumnDef="productName">
                <th mat-header-cell *matHeaderCellDef> Product </th>
                <td mat-cell *matCellDef="let item"> {{item.productName}} </td>
              </ng-container>

              <!-- Quantity Column -->
              <ng-container matColumnDef="quantity">
                <th mat-header-cell *matHeaderCellDef> Quantity </th>
                <td mat-cell *matCellDef="let item"> {{item.quantity}} </td>
              </ng-container>

              <!-- Price Column -->
              <ng-container matColumnDef="price">
                <th mat-header-cell *matHeaderCellDef> Price </th>
                <td mat-cell *matCellDef="let item"> {{item.price | currency}} </td>
              </ng-container>

              <!-- Total Column -->
              <ng-container matColumnDef="total">
                <th mat-header-cell *matHeaderCellDef> Total </th>
                <td mat-cell *matCellDef="let item"> {{item.total | currency}} </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div class="total-section">
              <h3>Total: {{invoice?.total | currency}}</h3>
            </div>
          </div>

          <div class="actions-row">
            <button mat-button routerLink="/invoices">Back to List</button>
            <button mat-raised-button color="primary" [routerLink]="['/invoices/edit', invoice?.id]">
              Edit Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .invoice-detail-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .info-section {
      margin: 20px 0;
    }

    .info-row {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
    }

    .items-section {
      margin-top: 20px;
    }

    table {
      width: 100%;
      margin-bottom: 20px;
    }

    .total-section {
      text-align: right;
      margin-top: 20px;
    }

    .actions-row {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 20px;
    }
  `]
})
export class InvoiceDetailComponent implements OnInit {
  invoice?: Invoice;
  displayedColumns: string[] = ['productName', 'quantity', 'price', 'total'];

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadInvoice(+id);
    }
  }

  loadInvoice(id: number): void {
    this.invoiceService.getInvoice(id).subscribe({
      next: (invoice) => {
        this.invoice = invoice;
      },
      error: (error) => {
        this.snackBar.open('Error loading invoice', 'Close', { duration: 3000 });
        console.error('Error loading invoice:', error);
      }
    });
  }
}
