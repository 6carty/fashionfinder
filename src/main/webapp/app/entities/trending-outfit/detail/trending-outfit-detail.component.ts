import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITrendingOutfit } from '../trending-outfit.model';

@Component({
  selector: 'jhi-trending-outfit-detail',
  templateUrl: './trending-outfit-detail.component.html',
})
export class TrendingOutfitDetailComponent implements OnInit {
  trendingOutfit: ITrendingOutfit | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trendingOutfit }) => {
      this.trendingOutfit = trendingOutfit;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
