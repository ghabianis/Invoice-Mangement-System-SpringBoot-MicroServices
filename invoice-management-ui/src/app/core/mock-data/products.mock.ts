import { Product } from '../models/product';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Laptop Pro X1',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    price: 1299.99,
    category: 'Electronics',
    stock: 50
  },
  {
    id: 2,
    name: 'Wireless Mouse M3',
    description: 'Ergonomic wireless mouse with long battery life',
    price: 29.99,
    category: 'Accessories',
    stock: 200
  },
  {
    id: 3,
    name: 'HD Monitor 27"',
    description: '27-inch 4K HD Monitor with built-in speakers',
    price: 349.99,
    category: 'Electronics',
    stock: 75
  },
  {
    id: 4,
    name: 'Mechanical Keyboard K7',
    description: 'RGB mechanical gaming keyboard with Cherry MX switches',
    price: 129.99,
    category: 'Accessories',
    stock: 100
  },
  {
    id: 5,
    name: 'USB-C Dock Station',
    description: '12-in-1 USB-C docking station with power delivery',
    price: 89.99,
    category: 'Accessories',
    stock: 150
  },
  {
    id: 6,
    name: 'Wireless Headphones H1',
    description: 'Noise-cancelling wireless headphones with 30h battery',
    price: 199.99,
    category: 'Audio',
    stock: 80
  }
];
