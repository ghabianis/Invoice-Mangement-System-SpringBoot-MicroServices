import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InvoiceService } from '../services/invoice.service';
import { Invoice, InvoiceItem } from '../../../core/models/invoice';
import { ProductService } from '../../products/services/product.service';
import { Product } from '../../../core/models/product';
import { Client } from '../../../core/models/client';
import { ClientService } from '../../../core/services/client.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm!: FormGroup;
  clients$!: Observable<Client[]>;
  products$!: Observable<Product[]>;
  editMode = false;
  invoiceId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private clientService: ClientService,
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
      this.router.navigate(['/invoices']);
      return;
    }

    this.initializeForm();
    this.loadData();
  }

  private initializeForm(): void {
    this.invoiceForm = this.fb.group({
      clientId: ['', Validators.required],
      date: ['', Validators.required],
      dueDate: ['', Validators.required],
      items: this.fb.array([]),
      notes: [''],
      subtotal: [{ value: 0, disabled: true }],
      tax: [{ value: 0, disabled: true }],
      total: [{ value: 0, disabled: true }]
    });
  }

  private loadData(): void {
    this.clients$ = this.clientService.getClients();
    this.products$ = this.productService.getProducts();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.invoiceId = +id;
      this.loadInvoice(this.invoiceId);
    } else {
      this.addItem();
    }
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [{ value: 0, disabled: true }],
      total: [{ value: 0, disabled: true }]
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.calculateTotals();
  }

  loadInvoice(id: number): void {
    this.invoiceService.getInvoice(id).subscribe({
      next: (invoice) => {
        if (invoice) {
          this.invoiceForm.patchValue({
            clientId: invoice.clientId,
            date: invoice.date,
            dueDate: invoice.dueDate,
            notes: invoice.notes,
            subtotal: invoice.subtotal,
            tax: invoice.tax,
            total: invoice.total
          });

          // Clear existing items
          while (this.items.length) {
            this.items.removeAt(0);
          }

          // Add invoice items
          invoice.items.forEach(item => {
            const itemGroup = this.createItem();
            itemGroup.patchValue({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total
            });
            this.items.push(itemGroup);
          });
        }
      },
      error: (error) => {
        this.snackBar.open('Error loading invoice', 'Close', { duration: 3000 });
        console.error('Error loading invoice:', error);
      }
    });
  }

  onProductChange(control: AbstractControl): void {
    if (!control || !(control instanceof FormGroup)) return;
    
    const productId = control.get('productId')?.value;
    if (productId) {
      this.productService.getProduct(productId).subscribe(product => {
        if (product) {
          control.patchValue({
            unitPrice: product.price
          }, { emitEvent: false });
          this.updateItemTotal(control);
        }
      });
    }
  }

  onQuantityChange(control: AbstractControl): void {
    if (!control || !(control instanceof FormGroup)) return;
    this.updateItemTotal(control);
  }

  updateItemTotal(itemGroup: FormGroup): void {
    const quantity = itemGroup.get('quantity')?.value || 0;
    const unitPrice = itemGroup.get('unitPrice')?.value || 0;
    const total = quantity * unitPrice;
    itemGroup.patchValue({ total }, { emitEvent: false });
    this.calculateTotals();
  }

  calculateTotals(): void {
    const subtotal = this.items.controls.reduce((sum, item) => {
      return sum + (item.get('total')?.value || 0);
    }, 0);
    const tax = subtotal * 0.1; // 10% tax rate
    const total = subtotal + tax;

    this.invoiceForm.patchValue({
      subtotal,
      tax,
      total
    });
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      const formValue = this.invoiceForm.getRawValue();
      const invoice: Partial<Invoice> = {
        clientId: formValue.clientId,
        date: formValue.date,
        dueDate: formValue.dueDate,
        items: formValue.items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total
        })),
        subtotal: formValue.subtotal,
        tax: formValue.tax,
        total: formValue.total,
        notes: formValue.notes,
        status: this.editMode ? undefined : 'DRAFT'
      };

      const operation = this.editMode && this.invoiceId
        ? this.invoiceService.updateInvoice(this.invoiceId, invoice)
        : this.invoiceService.createInvoice(invoice as Omit<Invoice, 'id'>);

      operation.subscribe({
        next: () => {
          this.snackBar.open(
            `Invoice ${this.editMode ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/invoices']);
        },
        error: (error) => {
          this.snackBar.open(
            `Error ${this.editMode ? 'updating' : 'creating'} invoice`,
            'Close',
            { duration: 3000 }
          );
          console.error('Error saving invoice:', error);
        }
      });
    }
  }
}
