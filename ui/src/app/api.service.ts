import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItemResponse, OrderResponse } from './typings';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://localhost:5000/'

  constructor(private http: HttpClient) { }

  getRandomItem() {
    return this.http.get<ItemResponse>(this.baseUrl + 'getItem');
  }

  placeOrder(itemName: string) {
    return this.http.get<OrderResponse>(this.baseUrl + 'placeOrder', {
      params: {
        itemName: itemName
      }
    });
  }
}
