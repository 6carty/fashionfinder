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
import { IUser } from '../entities/user/user.model';
import { IUserProfile } from '../entities/user-profile/user-profile.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../entities/user/user.service';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { min } from '@popperjs/core/lib/utils/math';

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
  outfitReceivedData: IOutfit[] | null = null;
  outfitHead: IOutfit[] | null = null;
  outfitTail: IOutfit[] | null = null;
  isSaving = false;
  clothingItem: IClothingItem | null = null;
  userInputName: any;
  userInputDescription: any;
  userInputPhoto: any;

  account: Account | null = null;
  private accountSubscription: Subscription | null = null;
  protected itemLogs: IItemLog[] | null = null;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private clothingItemService: ClothingItemService,
    private outfitService: OutfitService,
    private itemLogService: ItemLogService,
    protected activatedRoute: ActivatedRoute,
    private userService: UserService,
    private userProfileService: UserProfileService
  ) {}
  givenId: number = -1;
  active: Account | undefined = undefined;
  users: IUser[] | null = null;
  user: IUser | undefined = undefined;
  userProfiles: IUserProfile[] | undefined = undefined;
  userProfile: IUserProfile | undefined = undefined;
  userProfilePick: Pick<IUserProfile, 'id'> | null = null;
  id: number = 0;

  ngOnInit(): void {
    this.accountSubscription = this.accountService.identity().subscribe((account: Account | null) => {
      this.account = account;
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.givenId = params.id;

      this.accountService.identity().subscribe(account => {
        if (account) this.active = account;

        this.userService.query().subscribe(users => {
          this.users = users.body;
          if (this.users) this.user = this.users.find(user => user.login === this.active?.login);
          if (this.user) {
            const pickUser: Pick<IUser, 'id'> = this.user;
            const queryObject = {
              'user.equal': pickUser,
            };
            this.userProfileService.query(queryObject).subscribe(userProfile => {
              if (userProfile.body) {
                this.userProfiles = userProfile.body.filter(obj => obj.user?.id == this.user?.id);
                this.userProfile = this.userProfiles[0];
                this.userProfilePick = this.userProfile;
              }

              this.fetchClothes();
            });
          }
        });
      });
    });
  }

  fetchClothes() {
    this.clothingItemService.query().subscribe(clothingItems => {
      this.clothingReceivedData = clothingItems.body;
      if (this.clothingReceivedData) {
        this.clothingReceivedData = this.clothingReceivedData.filter(obj => obj.owner?.id == this.userProfile?.id);
        this.numberOfItems = <number>this.clothingReceivedData.length;
        this.findBreakupItem(this.clothingReceivedData);
        //this.fetchMatchingOutfits();
      }
    });
    this.fetchOutfits();
  }

  fetchOutfits() {
    this.outfitService.query().subscribe(outfits => {
      this.outfitReceivedData = outfits.body;
      if (this.outfitReceivedData) {
        this.outfitReceivedData = this.outfitReceivedData.filter(obj => obj.creator?.id == this.userProfile?.id);
        this.numberOfOutfits = <number>this.outfitReceivedData.length;
        this.assessVars(this.outfitReceivedData);
        //this.fetchMatchingOutfits();
        this.headTail(this.outfitReceivedData);
      }
    });
    this.fetchItemLogs();
  }

  fetchItemLogs() {
    this.itemLogService.query().subscribe(itemLogs => {
      this.itemLogs = itemLogs.body;
      if (this.itemLogs) {
        this.itemLogs = this.itemLogs.filter(obj => obj.owner?.id == this.user?.id);
        this.itemLogs = this.itemLogs.reverse();
        this.numberOfLogs = <number>this.itemLogs.length;
        //this.fetchMatchingOutfits();
      }
    });
  }

  assessVars(copyData: IOutfit[]): void {
    var themeList: number[] = [0, 0, 0, 0];
    if (copyData) {
      for (var outfit of copyData) {
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

  findBreakupItem(copyData: IClothingItem[]): IClothingItem | null {
    let dateWorn: dayjs.Dayjs = dayjs();
    let candidate: IClothingItem | null = null;
    for (var item of copyData) {
      if (item.lastWorn) {
        if (item.lastWorn.isBefore(dateWorn)) {
          dateWorn = item.lastWorn;
          candidate = item;
        }
      }
    }
    return copyData[0];
  }

  findLinkedOutfits(id: number) {
    let num = 0;
    // @ts-ignore
    for (var itemLog of this.itemLogs) {
      if (itemLog.outfit?.id == id) {
        num += 1;
      }
    }
    return num;
  }

  headTail(copyData: IOutfit[]) {
    let temp: IOutfit[] = [];
    temp = copyData.sort((one, two) => {
      if (this.findLinkedOutfits(one.id) > this.findLinkedOutfits(two.id)) {
        return 1;
      }
      if (this.findLinkedOutfits(one.id) < this.findLinkedOutfits(two.id)) {
        return -1;
      }
      return 0;
    });
    this.outfitHead = temp.slice(0, min(temp.length + 1, 10));
    this.outfitTail = temp.reverse().slice(0, min(temp.length + 1, 10));
  }
}
