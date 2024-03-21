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
  userInput: any;
  userInput2: any;

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
    const inputElement = document.getElementById('clothingItemNameField') as HTMLInputElement;
    this.userInput = inputElement.value;

    const inputElement2 = document.getElementById('clothingItemDescriptionField') as HTMLInputElement;
    this.userInput2 = inputElement2.value;

    const clothingItem: NewClothingItem = {
      id: null,
      name: this.userInput,
      description: this.userInput2,
      status: Status.NOTFORSALE,
      type: ClothingType.OTHERS,
    };

    this.subscribeToSaveResponseClothing(this.clothingItemService.create(clothingItem));
  }

  protected subscribeToSaveResponseClothing(result: Observable<HttpResponse<IClothingItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccessClothing(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccessClothing(): void {
    this.fetchClothes();
    this.fetchOutfits();
    window.location.reload();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
