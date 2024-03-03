import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILikes } from '../likes.model';

@Component({
  selector: 'jhi-likes-detail',
  templateUrl: './likes-detail.component.html',
})
export class LikesDetailComponent implements OnInit {
  likes: ILikes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ likes }) => {
      this.likes = likes;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
