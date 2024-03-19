import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOutfitPic } from '../outfit-pic.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-outfit-pic-detail',
  templateUrl: './outfit-pic-detail.component.html',
})
export class OutfitPicDetailComponent implements OnInit {
  outfitPic: IOutfitPic | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ outfitPic }) => {
      this.outfitPic = outfitPic;
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
