import { Component, OnInit } from '@angular/core';
import { ItemLogService } from '../entities/item-log/service/item-log.service';
import { EntityArrayResponseType } from '../entities/event/service/event.service';
import { IItemLog } from '../entities/item-log/item-log.model';
import { Account } from '../core/auth/account.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from '../core/auth/account.service';
import { IUser } from '../entities/user/user.model';
import { UserService } from '../entities/user/user.service';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { IUserProfile } from '../entities/user-profile/user-profile.model';
import { OutfitService } from '../entities/outfit/service/outfit.service';
import { IOutfit } from '../entities/outfit/outfit.model';

@Component({
  selector: 'jhi-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
})
export class DiaryComponent implements OnInit {
  protected itemLogs: any | IItemLog[] = [];
  protected account: Account | null = null;
  private accountSubscription: Subscription | null = null;
  protected logReceivedData: IItemLog[] | null = null;
  protected matchingOutfits: IOutfit[] = [];
  constructor(
    private router: Router,
    private accountService: AccountService,
    private itemLogService: ItemLogService,
    private userService: UserService,
    private userProfileService: UserProfileService,
    private outfitService: OutfitService,
    protected activatedRoute: ActivatedRoute
  ) {}
  givenId: number = -1;
  active: Account | undefined = undefined;
  users: IUser[] | null = null;
  user: IUser | undefined = undefined;
  userProfiles: IUserProfile[] | undefined = undefined;
  userProfile: IUserProfile | undefined = undefined;
  userProfilePick: Pick<IUserProfile, 'id'> | null = null;
  itemLogToEdit: IItemLog | null = null;
  id: number = 0;

  ngOnInit(): void {
    this.accountSubscription = this.accountService.identity().subscribe((account: Account | null) => {
      this.account = account;
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.givenId = params.id;

      this.accountService.identity().subscribe(account => {
        if (account) this.active = account;

        this.userService.query().subscribe(users => {
          this.users = users.body;
          if (this.users) this.user = this.users.find(user => user.login === this.active?.login);
          if (this.user) {
            const pickUser: Pick<IUser, 'id'> = this.user;
            const queryObject = {
              'user.equal': pickUser,
            };
            this.userProfileService.query(queryObject).subscribe(userProfile => {
              if (userProfile.body) {
                this.userProfiles = userProfile.body.filter(obj => obj.user?.id == this.user?.id);
                this.userProfile = this.userProfiles[0];
                this.userProfilePick = this.userProfile;
              }

              this.fetchItemLogs();
            });
          }
        });
      });
    });
  }

  fetchItemLogs() {
    this.itemLogService.query().subscribe(itemLogs => {
      this.logReceivedData = itemLogs.body;
      if (this.logReceivedData) {
        this.logReceivedData = this.logReceivedData.filter(obj => obj.owner?.id == this.user?.id);
        this.fetchMatchingOutfits();
      }
    });
  }

  fetchMatchingOutfits() {
    if (this.logReceivedData) {
      for (var itemLog of this.logReceivedData) {
        if (itemLog.owner) {
          this.matchingOutfits?.push(this.fetchSingleOutfit(itemLog.owner.id));
        }
      }
    }
  }

  fetchSingleOutfit(id: number): IOutfit {
    let temp: IOutfit[] = [];
    this.outfitService.query({ 'id.equals': id }).subscribe(outfit => {
      if (outfit.body) {
        temp = outfit.body;
      }
    });
    return temp[0];
  }

  addItemLog() {
    this.router.navigate(['/item-log/new']);
  }
}
