import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { ItemResponse, OrderResponse } from './typings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  headerText = 'Order a random item.';
  secondaryText = 'Press the button to order a random item from the selected restaurant.';
  itemButtonText = 'Random Item';
  orderButtonText = 'Place Order';

  showErrorModal = false;
  disableOrderButton = true;
  isLoading = false;

  item: ItemResponse | undefined;

  constructor(private apiService: ApiService) { }


  getRandomItem() {
    this.apiService.getRandomItem().subscribe((item: ItemResponse) => {
      this.item = item;
      this.headerText = item.name;
      this.secondaryText = item.description;
      this.disableOrderButton = false;
      this.itemButtonText = 'Try Again';
    });
  }

  placeOrder() {
    if (!this.item) { this.showErrorModal = true; return; }
    this.isLoading = true;
    this.apiService.placeOrder(this.item.name).subscribe((item: OrderResponse) => {
      const copy = this.headerText;
      this.headerText = `Successfully Ordered ${copy}`;
      this.secondaryText = 'Check your phone/email.';
      this.itemButtonText = 'Try Again';
      this.disableOrderButton = true;
      this.isLoading = false;
    });
  }
}
