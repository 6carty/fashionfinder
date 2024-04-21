import { Component, OnInit, Renderer2 } from '@angular/core';
import { ExchangeRequestService } from '../entities/exchange-request/service/exchange-request.service';
import { IExchangeRequest } from '../entities/exchange-request/exchange-request.model';
import { ProfileService } from '../layouts/profiles/profile.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from '../core/auth/account.model';
import { YoutubeService } from './YouTubeApi/youtube.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserManagementService } from '../admin/user-management/service/user-management.service';
import { IUser } from '../admin/user-management/user-management.model';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { IUserProfile } from '../entities/user-profile/user-profile.model';

@Component({
  selector: 'jhi-sustainability',
  templateUrl: './sustainability.component.html',
  styleUrls: ['./sustainability.component.scss'],
})
export class SustainabilityComponent implements OnInit {
  latestExchangeRequests: IExchangeRequest[] = [];
  account: Account | null = null;
  selectedExchangeRequest: IExchangeRequest | null = null;
  showErrorPopup = false;
  videos: any[] = [];
  users: IUser[] = [];
  userProfile: IUserProfile | null = null;

  constructor(
    private exchangeRequestService: ExchangeRequestService,
    private accountService: AccountService,
    private youtubeService: YoutubeService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private userManagementService: UserManagementService
  ) {}

  ngOnInit(): void {
    // Fetch exchange request data
    this.fetchLatestExchangeRequests();

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });

    this.youtubeService.getFashionGuideVideos().subscribe((response: any) => {
      this.videos = response.items.map((video: any) => ({
        ...video,
        snippet: {
          ...video.snippet,
          title: this.decodeHtmlEntity(video.snippet.title), // Decode HTML entities in title
        },
      }));
    });
    this.loadUsers();
  }
  loadUsers(): void {
    this.userManagementService.query().subscribe(response => {
      this.users = response.body || [];
    });
  }

  fetchLatestExchangeRequests(): void {
    this.exchangeRequestService.query().subscribe(response => {
      this.latestExchangeRequests = response.body || [];
      // Sort the latestExchangeRequests array in descending order based on the ID
      this.latestExchangeRequests.sort((a, b) => b.id - a.id);
      // Ensure only the latest 5 items are displayed
      this.latestExchangeRequests = this.latestExchangeRequests.slice(0, 5);
    });
  }

  selectItem(exchangeRequest: IExchangeRequest): void {
    this.selectedExchangeRequest = exchangeRequest;
  }

  confirmExchange(): void {
    if (this.selectedExchangeRequest) {
      // Implement logic to handle the exchange confirmation
      if (this.selectedExchangeRequest.creater?.id === this.selectedExchangeRequest.requester?.id) {
        this.showErrorPopup = true; // Show the error popup
        this.openErrorPopup();
        this.closePopup();
      } else {
        console.log('Exchange confirmed for:', this.selectedExchangeRequest.clothingItem);
        this.closePopup(); // Close the first popup
        this.openSecondPopup(); // Open the second popup when exchange is confirmed
      }

      // Clear the selected item after confirmation
      this.selectedExchangeRequest = null;
    }
  }

  cancelExchange(): void {
    // Implement logic to cancel the exchange
    console.log('Exchange canceled!');

    // Close the popup
    this.closePopup();
  }

  openPopup(): void {
    document.getElementById('popup')!.style.display = 'block';
  }

  openErrorPopup(): void {
    document.getElementById('error-popup')!.style.display = 'block';
  }

  closePopup(): void {
    document.getElementById('popup')!.style.display = 'none';
  }

  openSecondPopup(): void {
    document.getElementById('second-popup')!.style.display = 'block';
  }

  closeSecondPopup(): void {
    document.getElementById('second-popup')!.style.display = 'none';
  }

  closeThirdPopup(): void {
    document.getElementById('error-popup')!.style.display = 'none';
  }

  reloadPageToSeeLatestChoice(): void {
    window.location.reload();
  }

  decodeHtmlEntity(text: string): string {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
