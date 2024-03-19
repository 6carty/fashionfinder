import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IClothingPic } from '../clothing-pic.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-clothing-pic-detail',
  templateUrl: './clothing-pic-detail.component.html',
})
export class ClothingPicDetailComponent implements OnInit {
  clothingPic: IClothingPic | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clothingPic }) => {
      this.clothingPic = clothingPic;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
