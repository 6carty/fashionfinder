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

  messages = [
    { text: 'Hey, how are you', isSent: true, time: '12:50' },
    { text: 'I am good hbu', isSent: false, time: '13:00' },
    { text: 'Yeah I am doing good too', isSent: true, time: '13:05' },
    { text: 'I am so excited to post my outfit today', isSent: true, time: '13:00' },
    { text: 'Must be good', isSent: false, time: '13:01' },
    { text: "You're gonna love it just posted it", isSent: true, time: '13:10' },
    { text: 'Wow you were right I love your outfit today', isSent: false, time: '13:00' },
    { text: "Thanks Bob, can't wait to see what you're wearing today", isSent: false, time: '13:01' },
    { text: 'Just posted it', isSent: true, time: '13:10' },
    { text: 'What you think?', isSent: true, time: '13:11' },
    { text: 'That looks sick 🔥🔥🔥', isSent: false, time: '13:15' },
  ];

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
