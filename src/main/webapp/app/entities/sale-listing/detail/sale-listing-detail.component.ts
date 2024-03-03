import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISaleListing } from '../sale-listing.model';

@Component({
  selector: 'jhi-sale-listing-detail',
  templateUrl: './sale-listing-detail.component.html',
})
export class SaleListingDetailComponent implements OnInit {
  saleListing: ISaleListing | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ saleListing }) => {
      this.saleListing = saleListing;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
