export const environment = {
  production: false,
  useMockData: true, // Set to false to use real backend
  apiUrl: 'http://localhost:8888/api',
  auth: {
    loginUrl: 'http://localhost:8888/api/auth/signin',
    registerUrl: 'http://localhost:8888/api/auth/signup'
  },
  invoice: {
    baseUrl: 'http://localhost:8888/api/factures'
  },
  product: {
    baseUrl: 'http://localhost:8888/api/produits'
  },
  client: {
    baseUrl: 'http://localhost:8888/api/clients'
  }
};
