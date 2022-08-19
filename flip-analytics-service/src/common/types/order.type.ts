export interface OrderDtoCustomer {
  id: string;
  name: string;
}

export interface OrderDtoProduct {
  id: string;
  name: string;
  price: string;
}

export interface OrderDtoItem {
  product: OrderDtoProduct;
  quantity: number;
}

export interface OrderType {
  id: string;
  date: string;
  customer: OrderDtoCustomer;
  items: OrderDtoItem[];
}
