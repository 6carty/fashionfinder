import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItemLog } from '../item-log.model';

@Component({
  selector: 'jhi-item-log-detail',
  templateUrl: './item-log-detail.component.html',
})
export class ItemLogDetailComponent implements OnInit {
  itemLog: IItemLog | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemLog }) => {
      this.itemLog = itemLog;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
