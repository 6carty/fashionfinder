import { Component, OnInit } from '@angular/core';
import { ClothingItemService } from '../entities/clothing-item/service/clothing-item.service';

@Component({
  selector: 'jhi-wardrobe',
  templateUrl: './wardrobe.component.html',
  styleUrls: ['./wardrobe.component.scss'],
})
export class WardrobeComponent implements OnInit {
  recievedData: any;
  constructor(private clothingItemService: ClothingItemService) {}

  ngOnInit(): void {
    this.fetchClothingitem();
  }

  fetchClothingitem() {
    const request = {
      // Add filters, pagination, sorting options here
    };

    this.clothingItemService.query(request).subscribe(clothingItems => {
      this.recievedData = clothingItems.body;
    });
  }
}
