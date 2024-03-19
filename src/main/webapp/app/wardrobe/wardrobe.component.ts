import { Component, OnInit } from '@angular/core';
//import { ClothingItemService } from '../entities/clothing-item/service/clothing-item.service';
import { ClothingItemService } from '../entities/clothing-item/service/clothing-item.service';
import { NewClothingItem } from '../entities/clothing-item/clothing-item.model';
import { Status } from '../entities/enumerations/status.model';
import { ClothingType } from '../entities/enumerations/clothing-type.model';
import dayjs from 'dayjs/esm';

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

  addnewitem(): void {}
}
