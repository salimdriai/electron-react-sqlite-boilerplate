export interface Product {
  id: string;
  name: string;
  price: number;
  purchasingPrice: number;
  inStock: number;
  weight?: number;
  status?: string;
  unitSold: number;
  fabDate: string;
  expDate: string;
  createdAt: string;
  lastUpdated: string;
}
