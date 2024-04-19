import { Component, Input, OnInit } from '@angular/core';
//import { ClothingItemService } from '../entities/clothing-item/service/clothing-item.service';
import { ClothingItemService, EntityArrayResponseType } from '../entities/clothing-item/service/clothing-item.service';
import { IClothingItem, NewClothingItem } from '../entities/clothing-item/clothing-item.model';
import { Status } from '../entities/enumerations/status.model';
import { ClothingType } from '../entities/enumerations/clothing-type.model';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { OutfitService } from '../entities/outfit/service/outfit.service';
import { IOutfit, NewOutfit } from '../entities/outfit/outfit.model';
import { Occasion } from '../entities/enumerations/occasion.model';
import { Router, ActivatedRoute, ParamMap, Data } from '@angular/router';
import { ASC, DEFAULT_SORT_DATA, DESC, ITEM_DELETED_EVENT, SORT } from '../config/navigation.constants';
import { SortService } from '../shared/sort/sort.service';
import { ClothingItemDeleteDialogComponent } from '../entities/clothing-item/delete/clothing-item-delete-dialog.component';
import { DataUtils } from '../core/util/data-util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpParams } from '@angular/common/http';
import { IUser } from '../entities/user/user.model';
import { IUserProfile } from '../entities/user-profile/user-profile.model';
import { Account } from '../core/auth/account.model';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { AccountService } from '../core/auth/account.service';
import { UserService } from '../entities/user/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'jhi-outfit-edit',
  templateUrl: './outfit-edit.component.html',
  styleUrls: ['./outfit-edit.component.scss'],
})
export class OutfitEditComponent implements OnInit {
  @Input() givenId: number = -1;
  clothingReceivedData: IClothingItem[] | null = null;
  outfitReceivedData: IOutfit[] | null = null;
  outfitToEdit: IOutfit | null = null;
  clothesChosen: IClothingItem[] = [];
  clothesToUpdate: IClothingItem[] = [];
  clothingItems: IClothingItem[] = [];
  id: number = 0;
  inputElementName: any;
  inputElementDescription: string = '';
  userInputPhoto: any;
  isSaving = false;
  public show = true;
  inputElementOccasion: any;
  description: string = '';
  date: any;
  predicate = 'id';
  ascending = true;
  isLoading = false;
  deleting: boolean = false;
  outfitId: number = 0;
  users: IUser[] | null = null;
  user: IUser | undefined = undefined;
  userProfile: IUserProfile | undefined = undefined;
  userProfilePick: Pick<IUserProfile, 'id'> | null = null;
  active: Account | undefined = undefined;
  userProfiles: IUserProfile[] | undefined = undefined;
  sunny: boolean = false;
  rainy: boolean = false;
  windy: boolean = false;
  cold: boolean = false;
  hot: boolean = false;
  snowy: boolean = false;

  constructor(
    private clothingItemService: ClothingItemService,
    private outfitService: OutfitService,
    protected activatedRoute: ActivatedRoute,
    protected sortService: SortService,
    public router: Router,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    private userProfileService: UserProfileService,
    private accountService: AccountService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
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
    const queryObject = {
      eagerload: true,
      // IMPORTANT (god why the fuck does jhipster have nothing about this in their docs)
      // needed to get the data of which outfits the item belongs to
    };

    this.clothingItemService.query(queryObject).subscribe(clothingItems => {
      this.clothingReceivedData = clothingItems.body;
      if (this.clothingReceivedData)
        this.clothingReceivedData = this.clothingReceivedData.filter(obj => obj.owner?.id == this.userProfile?.id);
      this.fetchOutfits();
    });
  }

  fetchOutfits() {
    this.outfitService.query('include.creator, include.clothingItems').subscribe(outfits => {
      this.outfitReceivedData = outfits.body;
      if (this.outfitReceivedData) {
        this.outfitReceivedData = this.outfitReceivedData.filter(obj => obj.creator?.id == this.userProfile?.id);
      }
      if (this.givenId == -1) {
        var outfitData = this.outfitReceivedData;
        var clothingData = this.clothingReceivedData;
        var outfit: IOutfit;
        if (outfitData && clothingData) {
          for (let clothingItem of clothingData) {
            if (clothingItem.outfits != null) {
              for (outfit of outfitData) {
                for (let outfitID of clothingItem.outfits) {
                  if (outfitID.id == outfit.id) {
                    outfitData = outfitData.filter(obj => obj != outfit);
                  }
                }
              }
            }
          }
          if (outfitData?.length != 0) {
            this.outfitToEdit = outfitData[0];
          }
        }
      }
      if (this.givenId != -1 && this.outfitReceivedData) {
        for (let outfit of this.outfitReceivedData) {
          if (this.givenId == outfit.id) {
            this.outfitToEdit = outfit;
          }
        }
      }
      if (this.clothingReceivedData && this.outfitToEdit) {
        for (let clothingItem of this.clothingReceivedData) {
          if (clothingItem.outfits)
            for (let itemId of clothingItem.outfits) {
              if (itemId.id == this.outfitToEdit.id) {
                this.clothesChosen.push(clothingItem);
              }
            }
        }
      }
      const fullDescription = this.outfitToEdit?.description;
      if (fullDescription) {
        const descriptionInParts = fullDescription.split(',');
        this.description = descriptionInParts[0];
        for (let part of descriptionInParts) {
          if (part == 'sunny') {
            this.sunny = true;
          }
          if (part == 'rainy') {
            this.rainy = true;
          }
          if (part == 'windy') {
            this.windy = true;
          }
          if (part == 'cold') {
            this.cold = true;
          }
          if (part == 'hot') {
            this.hot = true;
          }
          if (part == 'snowy') {
            this.snowy = true;
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

  deleteButtonPressed() {
    if (this.outfitToEdit) {
      this.outfitId = this.outfitToEdit.id;
    }

    if (this.clothingReceivedData) {
      for (let item of this.clothingReceivedData) {
        if (item.outfits) {
          item.outfits = item.outfits.filter(obj => obj.id !== this.outfitId);
        }
      }
    }

    this.deleting = true;
    this.onSaveSuccessOutfit();
  }

  saveButtonPressed() {
    if (this.clothesChosen.length == 0) {
      return;
    }
    this.inputElementName = document.getElementById('Name') as HTMLInputElement;
    var writtenDescriptionElement = document.getElementById('Description') as HTMLInputElement;
    var writtenDescription = writtenDescriptionElement.value;
    writtenDescription = writtenDescription.split(',').join('');
    this.inputElementDescription = this.inputElementDescription.concat(writtenDescription);
    if (this.sunny) this.inputElementDescription = this.inputElementDescription.concat(',sunny');
    if (this.rainy) this.inputElementDescription = this.inputElementDescription.concat(',rainy');
    if (this.windy) this.inputElementDescription = this.inputElementDescription.concat(',windy');
    if (this.cold) this.inputElementDescription = this.inputElementDescription.concat(',cold');
    if (this.hot) this.inputElementDescription = this.inputElementDescription.concat(',hot');
    if (this.snowy) this.inputElementDescription = this.inputElementDescription.concat(',snowy');

    this.inputElementOccasion = document.getElementById('Occasion') as HTMLInputElement;
    if (this.outfitToEdit) {
      this.id = this.outfitToEdit.id;
    }

    //making a list of updated clothes item to upload later
    if (this.outfitToEdit && this.clothingReceivedData) {
      var pickId: Pick<IOutfit, 'id'> = this.outfitToEdit;

      var counter = 0;
      while (counter < this.clothingReceivedData.length) {
        this.clothingReceivedData[0].outfits?.filter(obj => obj.id !== this.outfitId);
        for (let cloth of this.clothesChosen) {
          if (this.clothingReceivedData[counter].id == cloth.id) {
            this.clothingReceivedData[counter].outfits?.push(pickId);
          }
        }
        counter += 1;
      }
    }

    const inputElementPhoto = document.getElementById('outfitPhoto') as HTMLInputElement;

    if (inputElementPhoto.files && inputElementPhoto.files.length != 0) {
      const selectedFile = inputElementPhoto.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          var base64result = reader.result.split(',')[1];
          this.userInputPhoto = base64result;
        } else {
          this.userInputPhoto = null;
        }

        const outfit: IOutfit = {
          id: this.id,
          name: this.inputElementName.value,
          occasion: this.inputElementOccasion.value,
          description: this.inputElementDescription,
          date: this.outfitToEdit?.date,
          creator: this.outfitToEdit?.creator,
        };

        if (inputElementPhoto.files) {
          outfit.image = this.userInputPhoto;
          outfit.imageContentType = inputElementPhoto.files[0].type;
        }

        this.subscribeToSaveResponseOutfit(this.outfitService.update(outfit));
      };

      if (selectedFile) {
        reader.readAsDataURL(selectedFile);
      }
    } else {
      const outfit: IOutfit = {
        id: this.id,
        name: this.inputElementName.value,
        occasion: this.inputElementOccasion.value,
        description: this.inputElementDescription,
        image: this.outfitToEdit?.image,
        imageContentType: this.outfitToEdit?.imageContentType,
        date: this.outfitToEdit?.date,
        creator: this.outfitToEdit?.creator,
      };
      this.subscribeToSaveResponseOutfit(this.outfitService.update(outfit));
    }
  }
  protected subscribeToSaveResponseOutfit(result: Observable<HttpResponse<IOutfit>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccessOutfit(),
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponseClothes(result: Observable<HttpResponse<IOutfit>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccessClothes(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccessOutfit(): void {
    if (this.clothingReceivedData != null && this.clothingReceivedData?.length != 0) {
      const clothingItem = this.clothingReceivedData[0];
      this.clothingReceivedData = this.clothingReceivedData.filter(obj => obj !== clothingItem);
      this.subscribeToSaveResponseClothes(this.clothingItemService.update(clothingItem));
    }
  }

  protected onSaveSuccessClothes(): void {
    if (this.clothingReceivedData != null && this.clothingReceivedData?.length != 0) {
      const clothingItem = this.clothingReceivedData[0];
      this.clothingReceivedData = this.clothingReceivedData.filter(obj => obj !== clothingItem);
      this.subscribeToSaveResponseClothes(this.clothingItemService.update(clothingItem));
    } else {
      if (this.deleting) {
        if (this.outfitToEdit != null) {
          this.outfitService.delete(this.outfitToEdit.id).subscribe(() => {
            this.router.navigate(['/wardrobe']);
          });
        }
      }
      if (this.givenId == -1) {
        this.router.navigate(['/wardrobe']);
      }
      if (!this.deleting && this.givenId != -1) {
        window.location.reload();
      }
    }
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }
  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
