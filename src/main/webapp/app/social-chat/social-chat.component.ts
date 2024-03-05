// In social-chat.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Account } from '../core/auth/account.model';
import { AccountService } from '../core/auth/account.service';

@Component({
  selector: 'jhi-social-chat',
  templateUrl: './social-chat.component.html',
  styleUrls: ['./social-chat.component.scss'],
})
export class SocialChatComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  private accountSubscription: Subscription | null = null;

  constructor(private accountService: AccountService, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.accountSubscription = this.accountService.identity().subscribe((account: Account | null) => {
      this.account = account;
      // Trigger change detection manually
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }
}
