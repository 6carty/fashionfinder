import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
    this.accountService.getAuthenticationState().subscribe((account: Account | null) => {
      this.account = account;

      if (account) {
        setTimeout(() => {
          const alertElement = this.elementRef.nativeElement.querySelector('.alert-success');
          if (alertElement) {
            this.renderer.addClass(alertElement, 'fade-out');
          }
        }, 3000);
      }
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  signUP(): void {
    this.router.navigate(['/account/register']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
