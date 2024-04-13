import { Component, OnInit } from '@angular/core';
import { ClothingItemService } from '../entities/clothing-item/service/clothing-item.service';
import { IClothingItem, NewClothingItem } from '../entities/clothing-item/clothing-item.model';
import { Status } from '../entities/enumerations/status.model';
import { ClothingType } from '../entities/enumerations/clothing-type.model';
import { Observable, Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { OutfitService } from '../entities/outfit/service/outfit.service';
import { IOutfit, NewOutfit } from '../entities/outfit/outfit.model';
import { Occasion } from '../entities/enumerations/occasion.model';
import { Account } from '../core/auth/account.model';
import { AccountService } from '../core/auth/account.service';

@Component({
  selector: 'jhi-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  numberOfItems: number = 0;
  numberOfOutfits: number = 0;
  topOccasion: string = 'Unknown';
  numberOfExchanged: number = 0;

  clothingReceivedData: IClothingItem[] | null = null;
  outfitReceivedData: any;
  isSaving = false;
  clothingItem: IClothingItem | null = null;
  userInputName: any;
  userInputDescription: any;
  userInputPhoto: any;

  account: Account | null = null;
  private accountSubscription: Subscription | null = null;

  constructor(
    private accountService: AccountService,
    private clothingItemService: ClothingItemService,
    private outfitService: OutfitService
  ) {}

  ngOnInit(): void {
    this.accountSubscription = this.accountService.identity().subscribe((account: Account | null) => {
      this.account = account;
    });
    this.fetchClothes();
  }

  fetchClothes() {
    this.clothingItemService.query('include.owner').subscribe(clothingItems => {
      this.clothingReceivedData = clothingItems.body;
      this.fetchOutfits();
    });
  }

  fetchOutfits() {
    this.outfitService.query('include.owner').subscribe(outfits => {
      this.outfitReceivedData = outfits.body;
      this.assessVars();
    });

    this.outfitReceivedData.unsubscribe();
  }

  assessVars(): void {
    if (!(typeof this.clothingReceivedData == undefined || this.clothingReceivedData == null)) {
      this.numberOfItems = <number>this.clothingReceivedData.length;
    }
    if (!(typeof this.outfitReceivedData == undefined || this.outfitReceivedData == null)) {
      this.numberOfOutfits = <number>this.outfitReceivedData.length;
    }
    var themeList: number[] = [0, 0, 0, 0];
    for (var outfit of this.outfitReceivedData) {
      switch (outfit?.occasion) {
        case 'FORMAL':
          themeList[0] += 1;
          break;
        case 'BUSINESS':
          themeList[1] += 1;
          break;
        case 'CASUAL':
          themeList[2] += 1;
          break;
        case 'SPORTS':
          themeList[3] += 1;
          break;
        default:
          break;
      }
    }
    const returnList: string[] = ['FORMAL', 'BUSINESS', 'CASUAL', 'SPORTS'];
    let max = 0;
    for (let x = 0; x < 4; x++) {
      if (themeList[x] > max) {
        max = themeList[x];
        this.topOccasion = returnList[x].toLowerCase();
      }
    }
  }
}
