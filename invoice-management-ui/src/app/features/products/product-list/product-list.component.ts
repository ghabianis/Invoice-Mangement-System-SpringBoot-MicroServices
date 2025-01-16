import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../services/product.service';
import { Product } from '../../../core/models/product';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="product-list-container">
      <div class="welcome-header">
        <h3>Welcome, {{username}}!</h3>
        <span class="role-badge" [class.admin-role]="isAdmin">{{isAdmin ? 'Admin' : 'User'}}</span>
      </div>
      
      <div class="header">
        <h2>Products</h2>
        <button mat-raised-button color="primary" routerLink="new" *ngIf="isAdmin">
          <mat-icon>add</mat-icon>
          Add Product
        </button>
      </div>

      <mat-form-field appearance="outline">
        <mat-label>Filter</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Ex. Milk" #input>
      </mat-form-field>

      <div class="mat-elevation-z8">
        <table mat-table [dataSource]="dataSource" matSort>
          <!-- ID Column -->
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
            <td mat-cell *matCellDef="let row"> {{row.id}} </td>
          </ng-container>

          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Name </th>
            <td mat-cell *matCellDef="let row"> {{row.name}} </td>
          </ng-container>

          <!-- Price Column -->
          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Price </th>
            <td mat-cell *matCellDef="let row"> {{row.price | currency}} </td>
          </ng-container>

          <!-- Quantity Column -->
          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Quantity </th>
            <td mat-cell *matCellDef="let row"> {{row.quantity}} </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let row">
              <button mat-icon-button color="primary" [routerLink]="['edit', row.id]" *ngIf="isAdmin">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteProduct(row.id)" *ngIf="isAdmin">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

          <!-- Row shown when there is no matching data. -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="5">No data matching the filter "{{input.value}}"</td>
          </tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of products"></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .product-list-container {
      padding: 20px;
    }

    .welcome-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }

    .role-badge {
      padding: 4px 8px;
      border-radius: 4px;
      background-color: #e0e0e0;
      font-size: 12px;
      font-weight: 500;
    }

    .admin-role {
      background-color: #2196f3;
      color: white;
    }

    .header {
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

    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
  `]
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'price', 'quantity', 'actions'];
  dataSource: MatTableDataSource<Product>;
  isAdmin: boolean = false;
  username: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource();
    const userInfo = this.authService.getUserInfo();
    this.isAdmin = userInfo?.roles?.includes('ROLE_ADMIN') || false;
    this.username = userInfo?.username || 'Guest';
    
    // Remove actions column for non-admin users
    if (!this.isAdmin) {
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'actions');
    }
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.dataSource.data = products;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.snackBar.open('Error loading products: ' + error.message, 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
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

  deleteProduct(id: number): void {
    if (!this.isAdmin) {
      this.snackBar.open('You do not have permission to delete products', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      return;
    }

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
        this.snackBar.open('Product deleted successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        this.snackBar.open('Error deleting product: ' + error.message, 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }
}
