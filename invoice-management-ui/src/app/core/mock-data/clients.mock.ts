import { Client } from '../models/client';

export const MOCK_CLIENTS: Client[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1234567890',
    address: '123 Main St, New York, NY',
    company: 'Tech Solutions Inc.'
  },
  {
    id: 2,
    name: 'Emma Johnson',
    email: 'emma.j@example.com',
    phone: '+1987654321',
    address: '456 Oak Ave, San Francisco, CA',
    company: 'Digital Innovations LLC'
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'm.brown@example.com',
    phone: '+1122334455',
    address: '789 Pine Rd, Chicago, IL',
    company: 'Creative Designs Co.'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 's.wilson@example.com',
    phone: '+1555666777',
    address: '321 Elm St, Boston, MA',
    company: 'Marketing Pro Services'
  },
  {
    id: 5,
    name: 'David Lee',
    email: 'd.lee@example.com',
    phone: '+1999888777',
    address: '654 Maple Dr, Seattle, WA',
    company: 'Software Solutions Ltd.'
  }
];
