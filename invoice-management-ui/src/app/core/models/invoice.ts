export interface InvoiceItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  clientId: number;
  clientName?: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE';
  notes?: string;
}
