// In social-chat.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Account } from '../core/auth/account.model';
import { AccountService } from '../core/auth/account.service';
import { Status } from '../entities/enumerations/status.model';
import { ChatroomService } from '../entities/chatroom/service/chatroom.service';
import { IChatroom, NewChatroom } from '../entities/chatroom/chatroom.model';
import { getUserIdentifier } from '../entities/user/user.model';
import { IUser } from 'app/entities/user/user.model';

@Component({
  selector: 'jhi-social-chat',
  templateUrl: './social-chat.component.html',
  styleUrls: ['./social-chat.component.scss'],
})
export class SocialChatComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  private accountSubscription: Subscription | null = null;
  private chatroomsSubscription: Subscription | null = null;
  chatroomReceivedData: any;
  isSaving = false;
  userInput: any;
  userInput2: any;
  userInput3: any;
  currentUser: any;

  constructor(
    private accountService: AccountService,
    private changeDetectorRef: ChangeDetectorRef,
    private chatroomService: ChatroomService
  ) {}

  fetchChatrooms(): void {
    this.chatroomsSubscription = this.chatroomService.query().subscribe(
      (response: HttpResponse<IChatroom[]>) => {
        this.chatroomReceivedData = response.body || [];
      },
      error => {
        console.error('There was an error fetching chatrooms:', error);
      }
    );
  }

  onCreateChatroomButtonClick() {
    const inputElement = document.getElementById('chatroomField') as HTMLInputElement;
    this.userInput = inputElement.value;

    const inputElement2 = document.getElementById('creatorField') as HTMLInputElement;
    this.userInput2 = inputElement2.value;

    const inputElement3 = document.getElementById('recipientField') as HTMLInputElement;
    this.userInput3 = inputElement3.value;

    const chatrooms: NewChatroom = {
      id: null,
      name: this.userInput,
      creator: { id: parseInt(this.userInput2, 10) },
      recipient: { id: parseInt(this.userInput3, 10) },
    };

    this.subscribeToSaveResponseChatroom(this.chatroomService.create(chatrooms));
  }

  protected subscribeToSaveResponseChatroom(result: Observable<HttpResponse<IChatroom>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccessChatroom(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccessChatroom(): void {
    this.fetchChatrooms();
    window.location.reload();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

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

  chatrooms = [
    { name: 'Sukhraj Mann', lastMessage: 'That looks sick 🔥🔥🔥', image: 'content/images/jhipster_family_member_1_head-192.png' },
    { name: 'Harry Richards', lastMessage: 'Thanks for the hoodie you...', image: 'content/images/jhipster_family_member_2_head-192.png' },
    { name: 'Bob John', lastMessage: 'Nice', image: 'content/images/jhipster_family_member_3_head-192.png' },
    { name: 'Pravjot Samra', lastMessage: 'Did you see the...', image: 'content/images/jhipster_family_member_2_head-192.png' },
    { name: 'Steve Jobs', lastMessage: 'This app is amazing', image: 'content/images/jhipster_family_member_3_head-192.png' },
    { name: 'Darwin Nunez', lastMessage: 'I need new joggers...', image: 'content/images/jhipster_family_member_2_head-192.png' },
    { name: 'Hasaan Ahmed', lastMessage: 'Thanks', image: 'content/images/jhipster_family_member_3_head-192.png' },
    { name: 'Michael Joe', lastMessage: 'Where did you buy...', image: 'content/images/jhipster_family_member_2_head-192.png' },
  ];
  selectedChatroom = null;

  currentChatPartner = {
    name: 'Sukhraj Mann',
    lastSeen: new Date(), // Replace with actual last seen data
    image: 'content/images/jhipster_family_member_1_head-192.png', // Replace with actual image path
  };

  ngOnInit(): void {
    this.accountSubscription = this.accountService.identity().subscribe((account: Account | null) => {
      this.account = account;
      this.changeDetectorRef.detectChanges();
      this.fetchChatrooms();

      // Load chat partner data when intializing component
      // this.loadCurrentChatPartner();

      // Load current selected chatroom
      // this.selectedChatroom();
    });

    // selectChatroom(chatroom): void {
    //   this.selectedChatroom = chatroom;
    //   // Load the messages for selected chatroom
    //   // You can implement loading messages from backend here
    // }

    // loadCurrentChatPartner(): void {
    //   Load the current chat partner details here
    // }
  }

  ngOnDestroy(): void {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
    if (this.chatroomsSubscription) {
      this.chatroomsSubscription.unsubscribe();
    }
  }
}
