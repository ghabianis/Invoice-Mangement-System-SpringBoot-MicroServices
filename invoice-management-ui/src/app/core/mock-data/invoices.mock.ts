import { Invoice, InvoiceItem } from '../models/invoice';

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 1,
    invoiceNumber: 'INV-2025-001',
    clientId: 1,
    clientName: 'John Smith',
    date: '2025-01-16',
    dueDate: '2025-02-15',
    items: [
      {
        productId: 1,
        quantity: 2,
        unitPrice: 1299.99,
        total: 2599.98
      },
      {
        productId: 2,
        quantity: 5,
        unitPrice: 29.99,
        total: 149.95
      }
    ],
    subtotal: 2749.93,
    tax: 247.49,
    total: 2997.42,
    status: 'PENDING'
  },
  {
    id: 2,
    invoiceNumber: 'INV-2025-002',
    clientId: 2,
    clientName: 'Emma Johnson',
    date: '2025-01-15',
    dueDate: '2025-02-14',
    items: [
      {
        productId: 3,
        quantity: 3,
        unitPrice: 349.99,
        total: 1049.97
      }
    ],
    subtotal: 1049.97,
    tax: 94.50,
    total: 1144.47,
    status: 'PAID',
    notes: 'Early payment discount applied'
  },
  {
    id: 3,
    invoiceNumber: 'INV-2025-003',
    clientId: 3,
    clientName: 'Michael Brown',
    date: '2025-01-14',
    dueDate: '2025-02-13',
    items: [
      {
        productId: 4,
        quantity: 10,
        unitPrice: 129.99,
        total: 1299.90
      },
      {
        productId: 5,
        quantity: 15,
        unitPrice: 89.99,
        total: 1349.85
      }
    ],
    subtotal: 2649.75,
    tax: 238.48,
    total: 2888.23,
    status: 'DRAFT'
  },
  {
    id: 4,
    invoiceNumber: 'INV-2024-004',
    clientId: 4,
    clientName: 'Sarah Wilson',
    date: '2024-12-15',
    dueDate: '2025-01-14',
    items: [
      {
        productId: 6,
        quantity: 8,
        unitPrice: 199.99,
        total: 1599.92
      }
    ],
    subtotal: 1599.92,
    tax: 144.00,
    total: 1743.92,
    status: 'OVERDUE'
  }
];
