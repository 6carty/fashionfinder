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
import dayjs from 'dayjs/esm';
import { dateComparator } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-tools';
import { EntityArrayResponseType } from '../entities/event/service/event.service';
import { ItemLogService } from '../entities/item-log/service/item-log.service';
import { IItemLog } from '../entities/item-log/item-log.model';

@Component({
  selector: 'jhi-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  numberOfItems = 0;
  numberOfOutfits = 0;
  topOccasion = 'Unknown';
  numberOfLogs = 0;
  breakupItem: IClothingItem | null = null;

  clothingReceivedData: IClothingItem[] | null = null;
  outfitReceivedData: any;
  isSaving = false;
  clothingItem: IClothingItem | null = null;
  userInputName: any;
  userInputDescription: any;
  userInputPhoto: any;

  account: Account | null = null;
  private accountSubscription: Subscription | null = null;
  protected itemLogs: any | IItemLog[] = [];

  constructor(
    private accountService: AccountService,
    private clothingItemService: ClothingItemService,
    private outfitService: OutfitService,
    private itemLogService: ItemLogService
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
      this.fetchItemLogs();
    });

    this.outfitReceivedData.unsubscribe();
  }

  fetchItemLogs() {
    this.itemLogService.query('include.owner').subscribe((itemLogs: EntityArrayResponseType) => {
      this.itemLogs = itemLogs.body || [];
      this.filterLogs();
      this.assessVars();
    });
  }

  filterLogs() {
    // Filter events that belong to the current user via userProfile, where the userProfile has the same login
    // This only works if userProfile is auto generated for each user, where account login === userProfile firstName
    this.itemLogs = this.itemLogs.filter((itemLog: { owner: any }) => {
      return itemLog.owner !== null && itemLog.owner.firstName === this.account?.login;
    });
  }

  assessVars(): void {
    if (!(typeof this.clothingReceivedData == undefined || this.clothingReceivedData == null)) {
      this.numberOfItems = <number>this.clothingReceivedData.length;
      if (this.findBreakupItem()) {
        this.breakupItem = this.findBreakupItem();
      }
    }
    if (!(typeof this.outfitReceivedData == undefined || this.outfitReceivedData == null)) {
      this.numberOfOutfits = <number>this.outfitReceivedData.length;
    }
    if (!(typeof this.itemLogs == undefined || this.itemLogs == null)) {
      this.numberOfLogs = <number>this.itemLogs.length;
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

  findBreakupItem(): IClothingItem | null {
    let dateWorn: dayjs.Dayjs;
    let candidate: IClothingItem | null;
    dateWorn = dayjs();
    candidate = null;
    const clothingReceivedData1 = this.clothingReceivedData;
    if (clothingReceivedData1 != null) {
      for (var item of clothingReceivedData1) {
        if (item.lastWorn != null) {
          if (!dateWorn.isBefore(item.lastWorn)) {
            dateWorn = item.lastWorn;
            candidate = item;
          }
        }
      }
    }
    return candidate;
  }
}
