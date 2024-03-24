import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from '../core/auth/account.service';
import { Account } from '../core/auth/account.model';
import { IUserProfile } from '../entities/user-profile/user-profile.model';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { IUser } from '../entities/user/user.model';
import { UserService } from '../entities/user/user.service';

@Component({
  selector: 'jhi-community-side-nav',
  templateUrl: './community-side-nav.component.html',
  styleUrls: ['./community-side-nav.component.scss'],
})
export class CommunitySideNavComponent implements OnInit {
  account: Account | null = null;
  protected userProfile: IUserProfile | null = null;
  private accountSubscription: Subscription | null = null;

  // private user: IUser | null = null;
  constructor(private accountService: AccountService, private userProfileService: UserProfileService, private userService: UserService) {}
  ngOnInit(): void {
    this.accountSubscription = this.accountService.identity().subscribe((account: Account | null) => {
      this.account = account;
    });
    this.userProfile = this.userProfileService.getUserProfile();
  }
}
