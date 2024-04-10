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
  inputElementDescription: any;
  userInputPhoto: any;
  isSaving = false;
  public show = true;
  inputElementOccasion: any;
  date: any;
  predicate = 'id';
  ascending = true;
  isLoading = false;

  constructor(
    private clothingItemService: ClothingItemService,
    private outfitService: OutfitService,
    protected activatedRoute: ActivatedRoute,
    protected sortService: SortService,
    public router: Router,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.givenId = params.id;
    });
    //this.load();
    this.fetchClothes();
  }

  fetchClothes() {
    const queryObject = {
      eagerload: true,
      // IMPORTANT (god why the fuck does jhipster have nothing about this in their docs)
      // needed to get the data of which outfits the item belongs to
    };

    this.clothingItemService.query(queryObject).subscribe(clothingItems => {
      this.clothingReceivedData = clothingItems.body;
      this.fetchOutfits();
    });
  }

  fetchOutfits() {
    this.outfitService.query('include.creator, include.clothingItems').subscribe(outfits => {
      this.outfitReceivedData = outfits.body;
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

  saveButtonPressed() {
    if (this.clothesChosen.length == 0) {
      return;
    }
    this.inputElementName = document.getElementById('Name') as HTMLInputElement;
    this.inputElementDescription = document.getElementById('Description') as HTMLInputElement;
    this.inputElementOccasion = document.getElementById('Occasion') as HTMLInputElement;
    if (this.outfitToEdit) {
      this.id = this.outfitToEdit.id;
    }

    //making a list of updated clothes item to upload later
    if (this.outfitToEdit && this.clothingReceivedData) {
      var pickId: Pick<IOutfit, 'id'> = this.outfitToEdit;
      for (let clothingItem of this.clothingReceivedData) {
        if (clothingItem.outfits != null) {
          clothingItem.outfits = clothingItem.outfits.filter(obj => obj !== pickId);
        }
        for (let cloth of this.clothesChosen) {
          if (cloth.id == clothingItem.id) {
            this.clothesChosen = this.clothesChosen.filter(obj => obj !== cloth);
            this.clothingReceivedData = this.clothingReceivedData.filter(obj => obj !== clothingItem);

            if (clothingItem.outfits == null) {
              clothingItem.outfits = [];
              clothingItem.outfits.push(pickId);
            } else {
              clothingItem.outfits.push(pickId);
            }

            this.clothingReceivedData.push(clothingItem);
          }
        }
      }
    }

    const inputElementPhoto = document.getElementById('outfitPhoto') as HTMLInputElement;

    if (inputElementPhoto.files) {
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
          description: this.inputElementDescription.value,
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
      window.location.reload();
    }
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }
  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
