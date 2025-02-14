import { Order } from './order';

export interface OrderRequest {
    order: Order;
    orderItems: { productId: number; quantity: number; price: number }[];
    sameAsDelivery: boolean;
}
