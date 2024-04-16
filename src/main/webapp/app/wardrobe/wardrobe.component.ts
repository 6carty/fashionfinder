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

@Component({
  selector: 'jhi-wardrobe',
  templateUrl: './wardrobe.component.html',
  styleUrls: ['./wardrobe.component.scss'],
})
export class WardrobeComponent implements OnInit {
  clothingReceivedData: IClothingItem[] | null = null;
  outfitReceivedData: any;
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
  filterSortType: boolean = false;
  filterSortAlphabetical: boolean = false;
  filterSortSize: boolean = false;

  formData = {
    name: '',
    occasion: '',
    colour: '',
  };
  constructor(private clothingItemService: ClothingItemService, private outfitService: OutfitService, private router: Router) {}

  ngOnInit(): void {
    this.fetchClothes();
  }

  trackByClothingId(index: number, clothingItem: IClothingItem): number {
    return clothingItem.id;
  }

  filterButtonPressed() {
    if (this.filterSortType && this.clothingReceivedData) {
      const inputElementType = document.getElementById('clothingItemTypeFilter') as HTMLInputElement;
      this.filteredItems = this.clothingReceivedData;
      this.filteredItems = this.filteredItems.filter(obj => obj.type?.toString() == inputElementType.value);
    } else {
      if (this.clothingReceivedData) {
        this.filteredItems = this.clothingReceivedData;
      }
    }

    if (this.filterSortAlphabetical && this.clothingReceivedData) {
      // @ts-ignore
      this.filteredItems.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  fetchClothes() {
    this.clothingItemService.query('include.owner').subscribe(clothingItems => {
      this.clothingReceivedData = clothingItems.body;
      if (this.clothingReceivedData) {
        this.filteredItems = this.clothingReceivedData;
      }
      this.fetchOutfits();
    });
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

    const userType = (document.getElementById('clothingItemTypeField') as HTMLInputElement).value;
    if (userType == 'SHIRTS') {
      this.userInputType = ClothingType.SHIRTS;
    }
    if (userType == 'OTHERS') {
      this.userInputType = ClothingType.OTHERS;
    }
    if (userType == 'HATS') {
      this.userInputType = ClothingType.HATS;
    }
    if (userType == 'DRESS') {
      this.userInputType = ClothingType.DRESS;
    }
    if (userType == 'SHOES') {
      this.userInputType = ClothingType.SHOES;
    }
    if (userType == 'ACCESSORIES') {
      this.userInputType = ClothingType.ACCESSORIES;
    }
    if (userType == 'TROUSERS') {
      this.userInputType = ClothingType.TROUSERS;
    }

    const inputElementPhoto = document.getElementById('clothingItemPhoto') as HTMLInputElement;

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

        const clothingItem: NewClothingItem = {
          id: null,
          name: this.userInputName,
          description: this.userInputDescription,
          status: Status.NOTFORSALE,
          type: this.userInputType,
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
    } else {
      const clothingItem: NewClothingItem = {
        id: null,
        name: this.userInputName,
        description: this.userInputDescription,
        status: Status.NOTFORSALE,
        type: ClothingType.OTHERS,
      };
      this.subscribeToSaveResponseClothing(this.clothingItemService.create(clothingItem));
    }
  }

  onCreateOutfitButtonClick() {
    const inputElementName = document.getElementById('OutfitNameField') as HTMLInputElement;
    this.userInputName = inputElementName.value;

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

        const outfit: NewOutfit = {
          id: null,
          name: this.userInputName,
          occasion: Occasion.BUSINESS,
          date: dayjs(),
        };
        if (inputElementPhoto.files) {
          outfit.image = this.userInputPhoto;
          outfit.imageContentType = inputElementPhoto.files[0].type;
        }

        this.subscribeToSaveResponseOutfit(this.outfitService.create(outfit));
      };

      if (selectedFile) {
        reader.readAsDataURL(selectedFile);
      }
    }
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
