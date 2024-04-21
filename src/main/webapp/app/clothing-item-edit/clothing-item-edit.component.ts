import { Component, OnInit } from '@angular/core';
//import { ClothingItemService } from '../entities/clothing-item/service/clothing-item.service';
import { ClothingItemService } from '../entities/clothing-item/service/clothing-item.service';
import { IClothingItem } from '../entities/clothing-item/clothing-item.model';
import { ClothingType } from '../entities/enumerations/clothing-type.model';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { OutfitService } from '../entities/outfit/service/outfit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SortService } from '../shared/sort/sort.service';
import { DataUtils } from '../core/util/data-util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IUser } from '../entities/user/user.model';
import { IUserProfile } from '../entities/user-profile/user-profile.model';
import { Account } from '../core/auth/account.model';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { AccountService } from '../core/auth/account.service';
import { UserService } from '../entities/user/user.service';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-clothing-item-edit',
  templateUrl: './clothing-item-edit.component.html',
  styleUrls: ['./clothing-item-edit.component.scss'],
})
export class ClothingItemEditComponent implements OnInit {
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

  clothingReceivedData: IClothingItem[] | null = null;
  clothingItemToEdit: IClothingItem | null = null;
  givenId: number = -1;
  id: number = 0;
  name: any;
  description: any;
  size: any;
  colour: any;
  style: any;
  brand: any;
  material: any;
  userInputPhoto: any;
  isSaving = false;
  users: IUser[] | null = null;
  user: IUser | undefined = undefined;
  userProfile: IUserProfile | undefined = undefined;
  userProfilePick: Pick<IUserProfile, 'id'> | null = null;
  active: Account | undefined = undefined;
  userProfiles: IUserProfile[] | undefined = undefined;
  type: ClothingType = ClothingType.OTHERS;

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
    this.clothingItemService.query().subscribe(clothingItems => {
      this.clothingReceivedData = clothingItems.body;
      if (this.clothingReceivedData)
        this.clothingReceivedData = this.clothingReceivedData.filter(obj => obj.owner?.id == this.userProfile?.id);

      if (this.clothingReceivedData) {
        for (let item of this.clothingReceivedData) {
          if (item.id == this.givenId) {
            this.clothingItemToEdit = item;
            this.id = this.clothingItemToEdit.id;
          }
        }
      }
    });
  }

  deleteButtonPressed() {
    if (this.clothingItemToEdit != null) {
      this.clothingItemService.delete(this.clothingItemToEdit.id).subscribe(() => {
        this.router.navigate(['/wardrobe']);
      });
    }
  }

  saveButtonPressed() {
    this.name = document.getElementById('Name') as HTMLInputElement;
    this.description = document.getElementById('Description') as HTMLInputElement;
    this.size = document.getElementById('ClothingSize') as HTMLInputElement;
    this.colour = document.getElementById('Colour') as HTMLInputElement;
    var type = document.getElementById('Type') as HTMLInputElement;

    if (type.value == 'SHIRTS') {
      this.type = ClothingType.SHIRTS;
    }
    if (type.value == 'SHOES') {
      this.type = ClothingType.SHOES;
    }
    if (type.value == 'DRESS') {
      this.type = ClothingType.DRESS;
    }
    if (type.value == 'TROUSERS') {
      this.type = ClothingType.TROUSERS;
    }
    if (type.value == 'HATS') {
      this.type = ClothingType.HATS;
    }
    if (type.value == 'ACCESSORIES') {
      this.type = ClothingType.ACCESSORIES;
    }
    if (type.value == 'OTHERS') {
      this.type = ClothingType.OTHERS;
    }

    this.brand = document.getElementById('Brand') as HTMLInputElement;
    this.material = document.getElementById('Material') as HTMLInputElement;
    const inputElementPhoto = document.getElementById('Photo') as HTMLInputElement;

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

        if (this.clothingItemToEdit) {
          this.clothingItemToEdit.name = this.name.value;
          this.clothingItemToEdit.description = this.description.value;
          this.clothingItemToEdit.clothingSize = this.size.value;
          this.clothingItemToEdit.colour = this.colour.value;
          this.clothingItemToEdit.brand = this.brand.value;
          this.clothingItemToEdit.material = this.material.value;
          this.clothingItemToEdit.type = this.type;
          this.clothingItemToEdit.lastWorn = dayjs();
        }

        if (inputElementPhoto.files && this.clothingItemToEdit) {
          this.clothingItemToEdit.image = this.userInputPhoto;
          this.clothingItemToEdit.imageContentType = inputElementPhoto.files[0].type;
        }
        if (this.clothingItemToEdit != null) {
          this.subscribeToSaveResponse(this.clothingItemService.update(this.clothingItemToEdit));
        }
      };

      if (selectedFile) {
        reader.readAsDataURL(selectedFile);
      }
    } else {
      if (this.clothingItemToEdit) {
        this.clothingItemToEdit.name = this.name.value;
        this.clothingItemToEdit.description = this.description.value;
        this.clothingItemToEdit.clothingSize = this.size.value;
        this.clothingItemToEdit.colour = this.colour.value;
        this.clothingItemToEdit.brand = this.brand.value;
        this.clothingItemToEdit.material = this.material.value;
        this.clothingItemToEdit.type = this.type;
        this.clothingItemToEdit.lastWorn = dayjs();
      }
      if (this.clothingItemToEdit != null) {
        this.subscribeToSaveResponse(this.clothingItemService.update(this.clothingItemToEdit));
      }
    }
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClothingItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccessClothing(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccessClothing(): void {
    window.location.reload();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
