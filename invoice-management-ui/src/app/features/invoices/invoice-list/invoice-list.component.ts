import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InvoiceService } from '../services/invoice.service';
import { Invoice } from '../../../core/models/invoice';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-list',
  template: `
    <div class="invoice-list-container">
      <div class="header-actions">
        <h1>Invoices</h1>
        <button *ngIf="isAdmin()" mat-raised-button color="primary" (click)="addInvoice()">
          <mat-icon>add</mat-icon>
          Add Invoice
        </button>
      </div>

      <mat-form-field appearance="outline">
        <mat-label>Filter</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Ex. Client name" #input>
      </mat-form-field>

      <div class="mat-elevation-z8">
        <table mat-table [dataSource]="dataSource" matSort>
          <!-- ID Column -->
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
            <td mat-cell *matCellDef="let row"> {{row.id}} </td>
          </ng-container>

          <!-- Date Column -->
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Date </th>
            <td mat-cell *matCellDef="let row"> {{row.date | date}} </td>
          </ng-container>

          <!-- Client Name Column -->
          <ng-container matColumnDef="clientName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Client </th>
            <td mat-cell *matCellDef="let row"> {{row.clientName}} </td>
          </ng-container>

          <!-- Total Column -->
          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Total </th>
            <td mat-cell *matCellDef="let row"> {{row.total | currency}} </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Status </th>
            <td mat-cell *matCellDef="let row"> {{row.status}} </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let row">
              <button mat-icon-button color="primary" (click)="viewInvoice(row)">
                <mat-icon>visibility</mat-icon>
              </button>
              <button *ngIf="isAdmin()" mat-icon-button color="accent" (click)="editInvoice(row)">
                <mat-icon>edit</mat-icon>
              </button>
              <button *ngIf="isAdmin()" mat-icon-button color="warn" (click)="deleteInvoice(row)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

          <!-- Row shown when there is no matching data. -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="6">No data matching the filter "{{input.value}}"</td>
          </tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of invoices"></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .invoice-list-container {
      padding: 20px;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .mat-form-field {
      width: 100%;
      margin-bottom: 20px;
    }

    table {
      width: 100%;
    }

    .mat-mdc-row .mat-mdc-cell {
      border-bottom: 1px solid transparent;
      border-top: 1px solid transparent;
      cursor: pointer;
    }

    .mat-mdc-row:hover .mat-mdc-cell {
      border-color: currentColor;
    }

    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
  `]
})
export class InvoiceListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'date', 'clientName', 'total', 'status', 'actions'];
  dataSource: MatTableDataSource<Invoice>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private invoiceService: InvoiceService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loadInvoices();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadInvoices(): void {
    this.invoiceService.getInvoices().subscribe({
      next: (invoices) => {
        this.dataSource.data = invoices;
      },
      error: (error) => {
        this.snackBar.open('Error loading invoices', 'Close', { duration: 3000 });
        console.error('Error loading invoices:', error);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAdmin(): boolean {
    const userInfo = this.authService.getUserInfo();
    return userInfo?.roles?.includes('ROLE_ADMIN');
  }

  addInvoice(): void {
    this.router.navigate(['/invoices/new']);
  }

  viewInvoice(invoice: Invoice): void {
    this.router.navigate(['/invoices', invoice.id]);
  }

  editInvoice(invoice: Invoice): void {
    this.router.navigate(['/invoices', invoice.id, 'edit']);
  }

  deleteInvoice(invoice: Invoice): void {
    if (confirm('Are you sure you want to delete this invoice?')) {
      this.invoiceService.deleteInvoice(invoice.id).subscribe({
        next: () => {
          this.snackBar.open('Invoice deleted successfully', 'Close', { duration: 3000 });
          this.loadInvoices();
        },
        error: (error) => {
          this.snackBar.open('Error deleting invoice', 'Close', { duration: 3000 });
          console.error('Error deleting invoice:', error);
        }
      });
    }
  }
}
