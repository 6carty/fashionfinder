import { Component, OnInit } from '@angular/core';
//import { ClothingItemService } from '../entities/clothing-item/service/clothing-item.service';
import { EntityArrayResponseType, ClothingItemService } from '../entities/clothing-item/service/clothing-item.service';

@Component({
  selector: 'jhi-wardrobe',
  templateUrl: './wardrobe.component.html',
  styleUrls: ['./wardrobe.component.scss'],
})
export class WardrobeComponent implements OnInit {
  recievedData: any;
  ownerId: any;
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

    //   this.clothingItemService.query(request).subscribe(clothingItems => {
    //     this.recievedData = clothingItems.body;
    //     console.log(this.recievedData);
    //     this.recievedData.forEach((clothingItem: { owner: { id: any; }; }) =>{
    //       this.ownerId= clothingItem.owner.id;
    //       console.log(this.ownerId);
    //     });

    //    });
  }
}
