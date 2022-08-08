export interface ItemResponse {
  name: string;
  description: string;
}

export interface OrderResponse {
  status: 'Success' | 'Error';
  message: string;
}
