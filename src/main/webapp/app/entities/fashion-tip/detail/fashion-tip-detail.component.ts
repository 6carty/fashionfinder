import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFashionTip } from '../fashion-tip.model';

@Component({
  selector: 'jhi-fashion-tip-detail',
  templateUrl: './fashion-tip-detail.component.html',
})
export class FashionTipDetailComponent implements OnInit {
  fashionTip: IFashionTip | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fashionTip }) => {
      this.fashionTip = fashionTip;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
