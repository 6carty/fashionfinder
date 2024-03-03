import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserMilestone } from '../user-milestone.model';

@Component({
  selector: 'jhi-user-milestone-detail',
  templateUrl: './user-milestone-detail.component.html',
})
export class UserMilestoneDetailComponent implements OnInit {
  userMilestone: IUserMilestone | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userMilestone }) => {
      this.userMilestone = userMilestone;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
