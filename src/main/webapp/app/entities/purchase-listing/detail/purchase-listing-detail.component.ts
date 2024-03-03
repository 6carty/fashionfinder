import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPurchaseListing } from '../purchase-listing.model';

@Component({
  selector: 'jhi-purchase-listing-detail',
  templateUrl: './purchase-listing-detail.component.html',
})
export class PurchaseListingDetailComponent implements OnInit {
  purchaseListing: IPurchaseListing | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ purchaseListing }) => {
      this.purchaseListing = purchaseListing;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
