import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AccountService } from '../core/auth/account.service';
import { Account } from '../core/auth/account.model';
import { IUserProfile } from '../entities/user-profile/user-profile.model';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { IUser } from '../entities/user/user.model';
import { UserManagementService } from '../admin/user-management/service/user-management.service';

@Component({
  selector: 'jhi-community-side-nav',
  templateUrl: './community-side-nav.component.html',
  styleUrls: ['./community-side-nav.component.scss'],
})
export class CommunitySideNavComponent implements OnInit {
  account: Account | null = null;
  protected userProfileSubscription: Subscription | null = null;
  myUserProfile: IUserProfile | null = null;
  myUser: IUser | null = null;
  userLogin: any;
  private accountSubscription: Subscription | null = null;

  // private user: IUser | null = null;
  constructor(
    private accountService: AccountService,
    private userProfileService: UserProfileService,
    private userManagementService: UserManagementService
  ) {}

  getUser(id: number): Observable<IUserProfile> {
    return this.userProfileService.getUserProfileById(id);
  }

  initialiseService(): void {
    if (this.account?.login) {
      this.userManagementService.find(this.account.login).subscribe({
        next: currentUser => {
          if (currentUser.id != null) {
            this.getUser(currentUser.id).subscribe(userProfile => {
              this.myUserProfile = userProfile;
            });
          }
        },
      });
    }
  }
  ngOnInit(): void {
    this.accountSubscription = this.accountService.identity().subscribe((account: Account | null) => {
      this.account = account;
      this.initialiseService();
    });
  }

  ngOnDestroy(): void {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }
}
