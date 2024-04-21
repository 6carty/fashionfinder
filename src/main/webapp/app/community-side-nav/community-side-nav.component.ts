import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AccountService } from '../core/auth/account.service';
import { Account } from '../core/auth/account.model';
import { IUserProfile } from '../entities/user-profile/user-profile.model';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { UserManagementService } from '../admin/user-management/service/user-management.service';

@Component({
  selector: 'jhi-community-side-nav',
  templateUrl: './community-side-nav.component.html',
  styleUrls: ['./community-side-nav.component.scss'],
})
export class CommunitySideNavComponent implements OnInit {
  account: Account | null = null;
  allUserProfiles: Observable<IUserProfile[]> | null = null;
  filteredProfile: IUserProfile[] | null = null;
  currentProfile: IUserProfile | null = null;
  private accountSubscription: Subscription | null = null;
  constructor(
    private accountService: AccountService,
    private userProfileService: UserProfileService,
    private userManagementService: UserManagementService
  ) {}

  initialiseService(): void {
    if (this.account?.login) {
      this.userManagementService.find(this.account.login).subscribe({
        next: currentUser => {
          if (currentUser.id != null) {
            this.allUserProfiles = this.userProfileService.getUserProfiles();
            this.allUserProfiles.subscribe(userProfiles => {
              this.filteredProfile = userProfiles.filter(profile => profile.user?.id == currentUser.id);
              this.currentProfile = this.filteredProfile[0];
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
