import { Component, OnInit } from '@angular/core';
//import { ClothingItemService } from '../entities/clothing-item/service/clothing-item.service';
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
import { Router } from '@angular/router';
import dayjs from 'dayjs/esm';
import { IUser } from '../entities/user/user.model';
import { UserService } from '../entities/user/user.service';
import { AccountService } from '../core/auth/account.service';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { IUserProfile } from '../entities/user-profile/user-profile.model';
import { Account } from '../core/auth/account.model';

@Component({
  selector: 'jhi-wardrobe',
  templateUrl: './wardrobe.component.html',
  styleUrls: ['./wardrobe.component.scss'],
})
export class WardrobeComponent implements OnInit {
  clothingReceivedData: IClothingItem[] | null = null;
  outfitReceivedData: IOutfit[] | null = null;
  isSaving = false;
  clothingItem: IClothingItem | null = null;
  userInputName: any;
  userInputDescription: any;
  userInputPhoto: any;
  userInputType: ClothingType = ClothingType.OTHERS;
  userInputOccasion: any;
  userInputSize: any;
  userInputBrand: any;
  userInputMaterial: any;
  filteredItems: IClothingItem[] = [];
  filterType: ClothingType | null = null;
  filterName: boolean = false;
  filterBrand: boolean = false;
  filterColour: boolean = false;
  users: IUser[] | null = null;
  user: IUser | undefined = undefined;
  userProfile: IUserProfile | undefined = undefined;
  userProfiles: IUserProfile[] | null = null;
  userProfilePick: Pick<IUserProfile, 'id'> | null = null;
  active: Account | undefined = undefined;

  formData = {
    name: '',
    occasion: '',
    colour: '',
  };
  constructor(
    private clothingItemService: ClothingItemService,
    private outfitService: OutfitService,
    private router: Router,
    private accountService: AccountService,
    private userService: UserService,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit(): void {
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
  }

  trackByClothingId(index: number, clothingItem: IClothingItem): number {
    return clothingItem.id;
  }

  filterNamePressed() {
    // @ts-ignore
    this.filteredItems.sort((a, b) => a.name.localeCompare(b.name));
  }

  filterBrandPressed() {
    // @ts-ignore
    this.filteredItems.sort((a, b) => a.brand.localeCompare(b.brand));
  }
  filterColourPressed() {
    // @ts-ignore
    this.filteredItems.sort((a, b) => a.colour.localeCompare(b.colour));
  }

  filterTypePressed() {
    const typeChosen = document.getElementById('Type') as HTMLInputElement;
    if (this.clothingReceivedData) {
      if (typeChosen.value == 'ALL') {
        this.filteredItems = this.clothingReceivedData;
      }
      if (typeChosen.value == 'SHIRTS') {
        this.filteredItems = this.clothingReceivedData;
        this.filteredItems = this.filteredItems.filter(obj => obj.type == ClothingType.SHIRTS);
      }
      if (typeChosen.value == 'SHOES') {
        this.filteredItems = this.clothingReceivedData;
        this.filteredItems = this.filteredItems.filter(obj => obj.type == ClothingType.SHOES);
      }
      if (typeChosen.value == 'DRESS') {
        this.filteredItems = this.clothingReceivedData;
        this.filteredItems = this.filteredItems.filter(obj => obj.type == ClothingType.DRESS);
      }
      if (typeChosen.value == 'TROUSERS') {
        this.filteredItems = this.clothingReceivedData;
        this.filteredItems = this.filteredItems.filter(obj => obj.type == ClothingType.TROUSERS);
      }
      if (typeChosen.value == 'HATS') {
        this.filteredItems = this.clothingReceivedData;
        this.filteredItems = this.filteredItems.filter(obj => obj.type == ClothingType.HATS);
      }
      if (typeChosen.value == 'ACCESSORIES') {
        this.filteredItems = this.clothingReceivedData;
        this.filteredItems = this.filteredItems.filter(obj => obj.type == ClothingType.ACCESSORIES);
      }
      if (typeChosen.value == 'OTHERS') {
        this.filteredItems = this.clothingReceivedData;
        this.filteredItems = this.filteredItems.filter(obj => obj.type == ClothingType.OTHERS);
      }
    }
  }

  fetchClothes() {
    this.clothingItemService.query().subscribe(clothingItems => {
      this.clothingReceivedData = clothingItems.body;
      if (this.clothingReceivedData) {
        this.clothingReceivedData = this.clothingReceivedData.filter(obj => obj.owner?.id == this.userProfile?.id);
        this.filteredItems = this.clothingReceivedData;
      }
      this.fetchOutfits();
    });
  }

  fetchOutfits() {
    this.outfitService.query().subscribe(outfits => {
      this.outfitReceivedData = outfits.body;
      if (this.outfitReceivedData) {
        this.outfitReceivedData = this.outfitReceivedData.filter(obj => obj.creator?.id == this.userProfile?.id);
      }
    });
  }

  onCreateItemButtonClick() {
    const inputElementPhoto = document.getElementById('clothingItemPhoto') as HTMLInputElement;

    const clothingItem: NewClothingItem = {
      id: null,
      name: '',
      status: Status.NOTFORSALE,
      type: ClothingType.OTHERS,
      owner: this.userProfilePick,
    };
    this.subscribeToSaveResponseClothing(this.clothingItemService.create(clothingItem));
  }

  onCreateOutfitButtonClick() {
    const outfit: NewOutfit = {
      id: null,
      name: '',
      occasion: Occasion.BUSINESS,
      date: dayjs(),
      creator: this.userProfilePick,
    };

    this.subscribeToSaveResponseOutfit(this.outfitService.create(outfit));
  }

  onOutfitClicked(id: number) {
    this.router.navigate(['/outfit-edit'], {
      queryParams: { id: id },
    });
  }

  onClothingItemClicked(id: number) {
    this.router.navigate(['/clothing-item-edit'], {
      queryParams: { id: id },
    });
  }

  protected subscribeToSaveResponseClothing(result: Observable<HttpResponse<IClothingItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccessClothing(),
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponseOutfit(result: Observable<HttpResponse<IOutfit>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccessOutfit(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccessClothing(): void {
    this.fetchClothes();
    window.location.reload();
  }
  protected onSaveSuccessOutfit(): void {
    this.router.navigate(['/outfit-edit'], {
      queryParams: { id: '-1' },
    });
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
