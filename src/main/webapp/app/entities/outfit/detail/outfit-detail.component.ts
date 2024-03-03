import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOutfit } from '../outfit.model';

@Component({
  selector: 'jhi-outfit-detail',
  templateUrl: './outfit-detail.component.html',
})
export class OutfitDetailComponent implements OnInit {
  outfit: IOutfit | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ outfit }) => {
      this.outfit = outfit;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
