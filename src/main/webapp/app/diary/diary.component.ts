import { Component, OnInit } from '@angular/core';
import { ItemLogService } from '../entities/item-log/service/item-log.service';
import { EntityArrayResponseType } from '../entities/event/service/event.service';
import { IItemLog } from '../entities/item-log/item-log.model';
import { Account } from '../core/auth/account.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from '../core/auth/account.service';

@Component({
  selector: 'jhi-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
})
export class DiaryComponent implements OnInit {
  protected itemLogs: any | IItemLog[] = [];
  protected account: Account | null = null;
  private accountSubscription: Subscription | null = null;
  constructor(private router: Router, private accountService: AccountService, private itemLogService: ItemLogService) {}

  ngOnInit(): void {
    this.accountSubscription = this.accountService.identity().subscribe((account: Account | null) => {
      this.account = account;
    });
    this.fetchItemLogs();
  }

  fetchItemLogs() {
    this.itemLogService.query('include.owner').subscribe((itemLogs: EntityArrayResponseType) => {
      this.itemLogs = itemLogs.body || [];
      //this.filterLogs();
    });
  }

  filterLogs() {
    // Filter events that belong to the current user via userProfile, where the userProfile has the same login
    // This only works if userProfile is auto generated for each user, where account login === userProfile firstName
    this.itemLogs = this.itemLogs.filter((itemLog: { owner: any }) => {
      return itemLog.owner !== null && itemLog.owner.firstName === this.account?.login;
    });
  }

  addItemLog() {
    this.router.navigate(['/item-log/new']);
  }
}
