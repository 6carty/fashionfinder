import { Component, OnInit } from '@angular/core';
//import { ClothingItemService } from '../entities/clothing-item/service/clothing-item.service';
import { ClothingItemService } from '../entities/clothing-item/service/clothing-item.service';
import { IClothingItem, NewClothingItem } from '../entities/clothing-item/clothing-item.model';
import { Status } from '../entities/enumerations/status.model';
import { ClothingType } from '../entities/enumerations/clothing-type.model';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { IOutfit, NewOutfit } from '../entities/outfit/outfit.model';
import { OutfitService } from '../entities/outfit/service/outfit.service';

@Component({
  selector: 'jhi-wardrobe',
  templateUrl: './wardrobe.component.html',
  styleUrls: ['./wardrobe.component.scss'],
})
export class WardrobeComponent implements OnInit {
  recievedData: any;
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

  formData = {
    name: '',
    occasion: '',
    colour: '',
  };
  constructor(private clothingItemService: ClothingItemService) {}

  ngOnInit(): void {
    //this.subscribeToSaveResponse(this.clothingItemService.create(clothingItem))

    this.fetchClothingitem();
  }

  fetchClothingitem() {
    const request = {
      include: ['owner'],

      // Add filters, pagination, sorting options here
    };
    this.clothingItemService.query('include.owner').subscribe(clothingItems => {
      this.recievedData = clothingItems.body;
    });

    this.recievedData.unsubscribe();
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClothingItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  previousState(): void {}
  addnewitem(): void {}
}
