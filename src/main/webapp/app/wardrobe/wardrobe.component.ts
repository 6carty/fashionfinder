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

@Component({
  selector: 'jhi-wardrobe',
  templateUrl: './wardrobe.component.html',
  styleUrls: ['./wardrobe.component.scss'],
})
export class WardrobeComponent implements OnInit {
  clothingReceivedData: any;
  outfitReceivedData: any;
  ownerId: any;
  currentUser: any;
  highestId: any;
  tempvalue: any;
  selectedItems: { id: number; isChecked: boolean }[] = [];
  newClothingItem: any;
  isSaving = false;
  clothingItem: IClothingItem | null = null;
  clothingTypeValues = Object.keys(ClothingType);
  statusValues = Object.keys(Status);
  userInputName: any;
  userInputDescription: any;
  userInputPhoto: any;

  formData = {
    name: '',
    occasion: '',
    colour: '',
  };
  constructor(private clothingItemService: ClothingItemService, private outfitService: OutfitService) {}

  ngOnInit(): void {
    //this.subscribeToSaveResponse(this.clothingItemService.create(clothingItem))
    this.fetchClothes();
  }

  fetchClothes() {
    this.clothingItemService.query('include.owner').subscribe(clothingItems => {
      this.clothingReceivedData = clothingItems.body;
      this.fetchOutfits();
    });

    this.clothingReceivedData.unsubscribe();
  }

  fetchOutfits() {
    this.outfitService.query('include.owner').subscribe(outfits => {
      this.outfitReceivedData = outfits.body;
    });

    this.outfitReceivedData.unsubscribe();
  }

  onCreateItemButtonClick() {
    const inputElementName = document.getElementById('clothingItemNameField') as HTMLInputElement;
    this.userInputName = inputElementName.value;

    const inputElementDescription = document.getElementById('clothingItemDescriptionField') as HTMLInputElement;
    this.userInputDescription = inputElementDescription.value;

    const inputElementPhoto = document.getElementById('clothingItemPhoto') as HTMLInputElement;

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

        const clothingItem: NewClothingItem = {
          id: null,
          name: this.userInputName,
          description: this.userInputDescription,
          status: Status.NOTFORSALE,
          type: ClothingType.OTHERS,
        };

        if (inputElementPhoto.files) {
          clothingItem.imageContentType = inputElementPhoto.files[0].type;
          clothingItem.image = this.userInputPhoto;
        }

        this.subscribeToSaveResponseClothing(this.clothingItemService.create(clothingItem));
      };

      if (selectedFile) {
        reader.readAsDataURL(selectedFile);
      }
    }
  }

  onCreateOutfitButtonClick() {
    const inputElement = document.getElementById('OutfitNameField') as HTMLInputElement;
    this.userInputName = inputElement.value;

    const outfit: NewOutfit = {
      id: null,
      name: this.userInputName,
      occasion: Occasion.BUSINESS,
    };

    this.subscribeToSaveResponseOutfit(this.outfitService.create(outfit));
  }

  protected subscribeToSaveResponseClothing(result: Observable<HttpResponse<IClothingItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccessClothing(),
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponseOutfit(result: Observable<HttpResponse<IOutfit>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccessClothing(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccessClothing(): void {
    this.fetchClothes();
    window.location.reload();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
