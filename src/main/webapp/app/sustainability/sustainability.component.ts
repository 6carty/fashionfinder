import { Component, OnInit } from '@angular/core';
import { ExchangeRequestService } from '../entities/exchange-request/service/exchange-request.service';
import { IExchangeRequest } from '../entities/exchange-request/exchange-request.model';
import { ProfileService } from '../layouts/profiles/profile.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from '../core/auth/account.model';

@Component({
  selector: 'jhi-sustainability',
  templateUrl: './sustainability.component.html',
  styleUrls: ['./sustainability.component.scss'],
})
export class SustainabilityComponent implements OnInit {
  latestExchangeRequests: IExchangeRequest[] = [];
  account: Account | null = null;
  selectedExchangeRequest: IExchangeRequest | null = null;

  // latestUserExchangeRequests: IExchangeRequest[] = [];
  // latestOtherExchangeRequests: IExchangeRequest[] = [];

  constructor(private exchangeRequestService: ExchangeRequestService, private accountService: AccountService) {}

  ngOnInit(): void {
    // Fetch exchange request data
    this.fetchLatestExchangeRequests();

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
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
      console.log('Exchange confirmed for:', this.selectedExchangeRequest.clothingItem);
      this.closePopup(); // Close the first popup
      this.openSecondPopup(); // Open the second popup when exchange is confirmed
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
    document.getElementById('third-popup')!.style.display = 'none';
  }

  reloadPageToSeeLatestChoice(): void {
    window.location.reload();
  }

  // back(): void {
  //   // Implement the logic to go back
  //   window.history.back();
  // }

  // openSecondPopup(): void {
  //   document.getElementById('secondPopup')!.style.display = 'block';
  // }

  // proceed(): void {
  //
  //   if (window.confirm("Do you really want to leave?")) {
  //     window.open("exit.html", "Thanks for Visiting!");
  //   }

  // const result = confirm("Are you sure you want to proceed?");
  // if (result) {
  //   // User clicked OK, proceed with action
  //   // For example, navigate to another page or perform some operation
  //   this.openSecondPopup();
  // } else {
  //   // User clicked Cancel, do nothing or handle accordingly
  // }
}

// ngOnInit(): void {
//   // Fetch and sort exchange request data
//   this.fetchAndSortLatestExchangeRequests();
//   this.accountService.identity().subscribe(account => {
//     if (account) {
//       this.userProfileService.getMyProfile().subscribe((currentUserProfile: IUserProfile) => {
//         // Retrieve the current user's profile ID
//         this.currentUserId = currentUserProfile.id;
//         this.filterExchangeRequests();
//       });
//     }
//   });
// }

// fetchAndSortLatestExchangeRequests(): void {
//   this.exchangeRequestService.query().subscribe((response) => {
//     const responseData: IExchangeRequest[] = response.body || [];
//     // Sort the responseData array in descending order based on the ID
//     responseData.sort((a, b) => b.id - a.id);
//     // Ensure only the latest 5 items are displayed
//     this.latestExchangeRequests = responseData.slice(0, 5);
//     this.filterExchangeRequests();
//   });
// }

// filterExchangeRequests(): void {
//   if (this.currentUserId) {
//     this.latestUserExchangeRequests = this.latestExchangeRequests.filter(req => req.requester?.id === this.currentUserId);
//     this.latestOtherExchangeRequests = this.latestExchangeRequests.filter(req => req.requester?.id !== this.currentUserId);
//   }
// }

// fetchAndSortLatestExchangeRequests(): void {
//   // Fetch exchange request data
//   this.exchangeRequestService.query().subscribe((response) => {
//     const responseData: IExchangeRequest[] = response.body || [];
//     // Sort the responseData array in descending order based on the ID
//     responseData.sort((a, b) => b.id - a.id);
//     // Ensure only the latest 5 items are displayed
//     this.latestExchangeRequests = responseData.slice(0, 5);
//
//     // Fetch current user's profile
//     this.userProfileService.getMyProfile().subscribe((currentUserProfile: IUserProfile) => {
//       // Retrieve the current user's profile ID
//       const currentUserId = currentUserProfile.id;
//
//       console.log('Current User ID:', currentUserId);
//
//
//       // Filter exchange requests based on current user's profile ID
//       this.latestUserExchangeRequests = this.latestExchangeRequests.filter(req => req.requester?.id === currentUserId);
//       this.latestOtherExchangeRequests = this.latestExchangeRequests.filter(req => req.requester?.id !== currentUserId);
//     });
//   });
// }
//

// fetchAndSortLatestExchangeRequests(): void {
//   this.exchangeRequestService.query().subscribe((response) => {
//     const responseData: IExchangeRequest[] = response.body || [];
//     // Sort the responseData array in descending order based on the ID
//     responseData.sort((a, b) => b.id - a.id);
//     // Ensure only the latest 5 items are displayed
//     this.latestExchangeRequests = responseData.slice(0, 5);
//   });
//
//     // Fetch current user's profile
//     this.userProfileService.getMyProfile().subscribe((currentUserProfile: IUserProfile) => {
//       // Retrieve the current user's profile ID
//       const currentUserId = currentUserProfile.id;
//
//       // Filter exchange requests based on current user's profile ID
//       this.latestUserExchangeRequests = slicedExchangeRequests.filter(req => req.requester?.id === currentUserId);
//       this.latestOtherExchangeRequests = slicedExchangeRequests.filter(req => req.requester?.id !== currentUserId);
//     });
//   });
// }

// fetchAndSortLatestExchangeRequests(): void {
//   this.exchangeRequestService.query().subscribe((response) => {
//     const latestExchangeRequests: IExchangeRequest[] = response.body || [];
//     // Sort the latestExchangeRequests array in descending order based on the ID
//     latestExchangeRequests.sort((a, b) => b.id - a.id);
//     // Ensure only the latest 5 items are displayed
//     const slicedExchangeRequests = latestExchangeRequests.slice(0, 5);
//
//     // Fetch current user's profile ID
//     this.accountService.identity().subscribe(account => {
//       // @ts-ignore
//       const currentUserId = account?.id;
//
//       if (currentUserId) {
//         this.userProfileService.find(currentUserId).subscribe((userProfile: IUserProfile) => {
//           // Filter exchange requests based on current user's profile ID
//           if (userProfile) {
//             this.latestUserExchangeRequests = slicedExchangeRequests.filter(req => req.requester?.id === userProfile.id);
//             this.latestOtherExchangeRequests = slicedExchangeRequests.filter(req => req.requester?.id !== userProfile.id);
//           }
//         });
//       }
//     });
//   });
// }
// fetchAndSortLatestExchangeRequests(): void {
//   this.exchangeRequestService.query().subscribe((response) => {
//     this.latestExchangeRequests = response.body || [];
//     // Sort the latestExchangeRequests array in descending order based on the ID
//     this.latestExchangeRequests.sort((a, b) => b.id - a.id);
//     // Ensure only the latest 5 items are displayed
//     this.latestExchangeRequests = this.latestExchangeRequests.slice(0, 5);
//   });
// }

// ngOnInit(): void {
//   // Fetch exchange request data
//   this.fetchLatestExchangeRequests();
// }
//
//
//
// fetchLatestExchangeRequests(): void {
//   this.exchangeRequestService.query().subscribe((response) => {
//     this.latestExchangeRequests = response.body || [];
//     // Sort the latestExchangeRequests array in descending order based on the ID
//     this.latestExchangeRequests.sort((a, b) => b.id - a.id);
//     // Ensure only the latest 5 items are displayed
//     this.latestExchangeRequests = this.latestExchangeRequests.slice(0, 5);
//   });
// }
