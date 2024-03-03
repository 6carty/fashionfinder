import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExchangeRequest } from '../exchange-request.model';

@Component({
  selector: 'jhi-exchange-request-detail',
  templateUrl: './exchange-request-detail.component.html',
})
export class ExchangeRequestDetailComponent implements OnInit {
  exchangeRequest: IExchangeRequest | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exchangeRequest }) => {
      this.exchangeRequest = exchangeRequest;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
