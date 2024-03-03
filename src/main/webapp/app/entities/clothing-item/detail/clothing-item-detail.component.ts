import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IClothingItem } from '../clothing-item.model';

@Component({
  selector: 'jhi-clothing-item-detail',
  templateUrl: './clothing-item-detail.component.html',
})
export class ClothingItemDetailComponent implements OnInit {
  clothingItem: IClothingItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clothingItem }) => {
      this.clothingItem = clothingItem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
