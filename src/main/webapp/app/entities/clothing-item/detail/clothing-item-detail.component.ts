import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IClothingItem } from '../clothing-item.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-clothing-item-detail',
  templateUrl: './clothing-item-detail.component.html',
})
export class ClothingItemDetailComponent implements OnInit {
  clothingItem: IClothingItem | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clothingItem }) => {
      this.clothingItem = clothingItem;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
