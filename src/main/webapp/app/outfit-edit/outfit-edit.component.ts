import { Component, OnInit } from '@angular/core';
import { ClothingItemService } from '../entities/clothing-item/service/clothing-item.service';
import { IClothingItem, NewClothingItem } from '../entities/clothing-item/clothing-item.model';
import { Status } from '../entities/enumerations/status.model';
import { ClothingType } from '../entities/enumerations/clothing-type.model';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { OutfitService } from '../entities/outfit/service/outfit.service';
import { IOutfit, NewOutfit } from '../entities/outfit/outfit.model';
import { Occasion } from '../entities/enumerations/occasion.model';

@Component({
  selector: 'jhi-outfit-edit',
  templateUrl: './outfit-edit.component.html',
  styleUrls: ['./outfit-edit.component.scss'],
})
export class OutfitEditComponent implements OnInit {
  clothingReceivedData: IClothingItem[] | null = null;
  outfitReceivedData: IOutfit[] | null = null;
  outfitToEdit: IOutfit | null = null;
  clothesChosen: IClothingItem[] = [];
  public show = true;

  constructor(private clothingItemService: ClothingItemService, private outfitService: OutfitService) {}

  ngOnInit(): void {
    this.fetchClothes();
  }

  fetchClothes() {
    this.clothingItemService.query('include.owner').subscribe(clothingItems => {
      this.clothingReceivedData = clothingItems.body;
      this.fetchOutfits();
    });
  }

  fetchOutfits() {
    this.outfitService.query('include.creator, include.clothingItems').subscribe(outfits => {
      this.outfitReceivedData = outfits.body;
      if (this.outfitReceivedData) {
        for (let outfit of this.outfitReceivedData) {
          if (outfit.clothingItems == null) {
            this.outfitToEdit = outfit;
          }
        }
      }
    });
  }

  trackByClothingId(index: number, clothingItem: IClothingItem): number {
    return clothingItem.id;
  }

  clothingItemPicked(clothingItemChosen: IClothingItem) {
    var inArrayAlready: boolean = false;
    if (this.clothingReceivedData) {
      for (let clothingItem of this.clothesChosen) {
        if (clothingItemChosen.id == clothingItem.id) {
          inArrayAlready = true;
        }
      }
      if (inArrayAlready) {
      } else {
        this.clothesChosen?.push(clothingItemChosen);
      }
    }
  }

  clothingItemRemoved(clothingItemChosen: IClothingItem) {
    if (this.clothesChosen) {
      this.clothesChosen = this.clothesChosen.filter(obj => obj !== clothingItemChosen);
    }
  }
}
