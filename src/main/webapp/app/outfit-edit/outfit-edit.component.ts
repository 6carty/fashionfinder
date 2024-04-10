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
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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
  clothesToUpdate: IClothingItem[] = [];
  id: number = 0;
  inputElementName: any;
  inputElementDescription: any;
  userInputPhoto: any;
  isSaving = false;
  public show = true;
  inputElementOccasion: any;
  date: any;

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

  saveButtonPressed() {
    this.inputElementName = document.getElementById('Name') as HTMLInputElement;
    this.inputElementDescription = document.getElementById('Description') as HTMLInputElement;
    this.inputElementOccasion = document.getElementById('Occasion') as HTMLInputElement;
    if (this.outfitToEdit) {
      this.id = this.outfitToEdit.id;
    }

    //making a list of updated clothes item to upload later

    for (let clothingItem of this.clothesChosen) {
      if (this.outfitToEdit) {
        var pickId: Pick<IOutfit, 'id'> = this.outfitToEdit;
        if (clothingItem.outfits == null) {
          clothingItem.outfits = [];
          clothingItem.outfits.push(pickId);
        } else {
          clothingItem.outfits.push(pickId);
        }
        this.clothesToUpdate.push(clothingItem);
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

  protected onSaveSuccessOutfit(): void {
    window.location.reload();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }
  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
