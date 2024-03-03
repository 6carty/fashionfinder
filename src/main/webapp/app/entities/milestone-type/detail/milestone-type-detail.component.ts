import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMilestoneType } from '../milestone-type.model';

@Component({
  selector: 'jhi-milestone-type-detail',
  templateUrl: './milestone-type-detail.component.html',
})
export class MilestoneTypeDetailComponent implements OnInit {
  milestoneType: IMilestoneType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ milestoneType }) => {
      this.milestoneType = milestoneType;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
