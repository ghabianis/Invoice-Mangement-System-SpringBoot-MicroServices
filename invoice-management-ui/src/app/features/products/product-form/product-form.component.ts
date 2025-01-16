import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../services/product.service';
import { Product } from '../../../core/models/product';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-form',
  template: `
    <div class="product-form-container">
      <div class="mat-elevation-z2">
        <div class="mat-headline-5 p-4">{{isEditMode ? 'Edit' : 'Add'}} Product</div>

        <div class="p-4">
          <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" placeholder="Product name">
              <mat-error *ngIf="productForm.get('name')?.errors?.['required']">
                Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Price</mat-label>
              <input matInput type="number" formControlName="price" placeholder="Product price">
              <mat-error *ngIf="productForm.get('price')?.errors?.['required']">
                Price is required
              </mat-error>
              <mat-error *ngIf="productForm.get('price')?.errors?.['min']">
                Price must be greater than 0
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Quantity</mat-label>
              <input matInput type="number" formControlName="quantity" placeholder="Product quantity">
              <mat-error *ngIf="productForm.get('quantity')?.errors?.['required']">
                Quantity is required
              </mat-error>
              <mat-error *ngIf="productForm.get('quantity')?.errors?.['min']">
                Quantity must be greater than or equal to 0
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/products">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="!productForm.valid">
                {{isEditMode ? 'Update' : 'Create'}}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-form-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }

    .mat-elevation-z2 {
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      background-color: #fff;
    }

    .mat-headline-5 {
      font-size: 1.25rem;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .p-4 {
      padding: 16px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    // Check if user is admin
    const userInfo = this.authService.getUserInfo();
    if (!userInfo?.roles?.includes('ROLE_ADMIN')) {
      this.snackBar.open('You do not have permission to access this page', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      this.router.navigate(['/products']);
      return;
    }

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct();
    }
  }

  loadProduct(): void {
    if (this.productId) {
      this.productService.getProduct(this.productId).subscribe({
        next: (product) => {
          this.productForm.patchValue(product);
        },
        error: (error) => {
          this.snackBar.open('Error loading product', 'Close', { duration: 3000 });
          console.error('Error loading product:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      
      const request = this.isEditMode && this.productId
        ? this.productService.updateProduct(this.productId, product)
        : this.productService.createProduct(product);

      request.subscribe({
        next: () => {
          this.snackBar.open(
            `Product ${this.isEditMode ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.snackBar.open(
            `Error ${this.isEditMode ? 'updating' : 'creating'} product`,
            'Close',
            { duration: 3000 }
          );
          console.error('Error saving product:', error);
        }
      });
    }
  }
}
