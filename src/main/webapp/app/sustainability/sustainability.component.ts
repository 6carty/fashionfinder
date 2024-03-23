import { Component, OnInit } from '@angular/core';
import { ExchangeRequestService} from "../entities/exchange-request/service/exchange-request.service";
import { IExchangeRequest} from "../entities/exchange-request/exchange-request.model";
import { AccountService} from "../core/auth/account.service";

@Component({
  selector: 'jhi-sustainability',
  templateUrl: './sustainability.component.html',
  styleUrls: ['./sustainability.component.scss'],
})
export class SustainabilityComponent implements OnInit {
  latestExchangeRequests: IExchangeRequest [] = [];
  account: any;


  constructor(private exchangeRequestService: ExchangeRequestService, private accountService: AccountService) {}

  ngOnInit(): void {
    // Fetch and sort exchange request data
    this.fetchAndSortLatestExchangeRequests();
    // Fetch current user's account information
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
  }

  fetchAndSortLatestExchangeRequests(): void {
    this.exchangeRequestService.query().subscribe((response) => {
      this.latestExchangeRequests = response.body || [];
      // Sort the latestExchangeRequests array in descending order based on the ID
      this.latestExchangeRequests.sort((a, b) => b.id - a.id);
      // Ensure only the latest 5 items are displayed
      this.latestExchangeRequests = this.latestExchangeRequests.slice(0, 5);
    });
  }

  // ngOnInit(): void {
  //   // Fetch exchange request data
  //   this.fetchLatestExchangeRequests();
  // }
  //
  //
  //
  // fetchLatestExchangeRequests(): void {
  //   this.exchangeRequestService.query().subscribe((response) => {
  //     this.latestExchangeRequests = response.body || [];
  //     // Sort the latestExchangeRequests array in descending order based on the ID
  //     this.latestExchangeRequests.sort((a, b) => b.id - a.id);
  //     // Ensure only the latest 5 items are displayed
  //     this.latestExchangeRequests = this.latestExchangeRequests.slice(0, 5);
  //   });
  // }
}
