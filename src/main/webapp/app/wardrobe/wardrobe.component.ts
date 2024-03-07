import { Component, OnInit } from '@angular/core';
//import { ClothingItemService } from '../entities/clothing-item/service/clothing-item.service';
import { ClothingItemService } from '../entities/clothing-item/service/clothing-item.service';
import { NewClothingItem } from '../entities/clothing-item/clothing-item.model';
import { Status } from '../entities/enumerations/status.model';
import { ClothingType } from '../entities/enumerations/clothing-type.model';

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

  formData = {
    name: '',
    occasion: '',
    colour: '',
  };
  constructor(private clothingItemService: ClothingItemService) {}

  ngOnInit(): void {
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

  onSubmit(): void {
    this.clothingItemService.query('include.owner').subscribe(clothingItems => {
      this.recievedData = clothingItems.body;
    });

    this.recievedData.unsubscribe();

    this.highestId = 0;
    for (this.tempvalue in this.recievedData) {
      if (this.tempvalue.id >= this.highestId) {
        this.highestId = this.tempvalue.id + 1;
      }
      const newClothingItem: NewClothingItem = {
        id: this.highestId,
        name: this.formData.name,
        style: this.formData.occasion,
        colour: this.formData.colour,
        status: Status.NOTFORSALE,
        type: ClothingType.OTHERS,
      };

      this.clothingItemService.create(newClothingItem);
    }
  }
}
