import { Component, OnInit } from '@angular/core';
import { ExchangeRequestService} from "../entities/exchange-request/service/exchange-request.service";
import { IExchangeRequest} from "../entities/exchange-request/exchange-request.model";

@Component({
  selector: 'jhi-sustainability',
  templateUrl: './sustainability.component.html',
  styleUrls: ['./sustainability.component.scss'],
})
export class SustainabilityComponent implements OnInit {
  exchangeRequest: IExchangeRequest | null = null;

  constructor(private exchangeRequestService: ExchangeRequestService) {}

  ngOnInit(): void {
    // Fetch exchange request data
    this.loadExchangeRequestDetails();
  }
  loadExchangeRequestDetails(): void {
    // Assuming you have a method in your service to fetch exchange request details by ID
    const exchangeRequestId = 1; // Replace this with the actual ID
    this.exchangeRequestService.find(exchangeRequestId).subscribe(
      (res) => {
        this.exchangeRequest = res.body;
      },
      (error) => {
        console.error('Error fetching exchange request details:', error);
      }
    );
  }
}
