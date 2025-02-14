import { Address } from '../common/address';

export class Order {
  id?: number;
  user?: any; // obiekt User
  orderItems?: OrderItem[];
  totalPrice?: number;
  active?: boolean;
  createdAt?: Date;
  lastUpdated?: Date;

  address: Address = new Address();
  invoiceAddress: Address = new Address();

  sameAsDelivery: boolean = true;
}

export class OrderItem {
    id?: number;
    order?: Order;
    product?: any;
    quantity: number = 0;
    price: number = 0;
}
