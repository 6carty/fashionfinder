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
  }
}
