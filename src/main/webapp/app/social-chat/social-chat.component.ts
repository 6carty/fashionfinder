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
import { UserManagementService } from '../admin/user-management/service/user-management.service';
import { IChatMessage, NewChatMessage } from '../entities/chat-message/chat-message.model';
import { ChatMessageService } from '../entities/chat-message/service/chat-message.service';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-social-chat',
  templateUrl: './social-chat.component.html',
  styleUrls: ['./social-chat.component.scss'],
})
export class SocialChatComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  private accountSubscription: Subscription | null = null;
  private chatroomsSubscription: Subscription | null = null;
  selectedChatroom: any;
  chatroomReceivedData: any;
  newMessageContent: string = '';
  isSaving = false;
  userInput: any;
  userInput2: any;
  userInput3: any;
  currentUser: any;

  constructor(
    private accountService: AccountService,
    private changeDetectorRef: ChangeDetectorRef,
    private chatroomService: ChatroomService,
    private userManagementService: UserManagementService,
    private chatMessageService: ChatMessageService
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
    const chatroomInputElement = document.getElementById('chatroomField') as HTMLInputElement;
    const recipientLoginElement = document.getElementById('recipientField') as HTMLInputElement;

    this.userInput = chatroomInputElement.value;
    this.userInput3 = recipientLoginElement.value;

    if (this.account?.login) {
      // First, find the ID of the currently logged-in user using their login.
      this.userManagementService.find(this.account.login).subscribe({
        next: creatorUser => {
          // Check if the user and the user's ID is not null
          if (creatorUser?.id != null) {
            this.findRecipientAndCreateChatroom(this.userInput, creatorUser.id, this.userInput3);
          } else {
            console.error(`No user found with login ${this.account?.login}`);
          }
        },
        error: error => {
          console.error('There was an error finding the creator user by login:', error);
        },
      });
    } else {
      console.error('No account is currently logged in, or the account does not have a login.');
    }
  }

  findRecipientAndCreateChatroom(chatroomName: string, creatorId: number, recipientLogin: string): void {
    this.userManagementService.find(recipientLogin).subscribe({
      next: recipientUser => {
        if (recipientUser?.id != null) {
          const chatroom: NewChatroom = {
            id: null,
            name: chatroomName,
            creator: { id: creatorId },
            recipient: { id: recipientUser.id },
          };

          this.subscribeToSaveResponseChatroom(this.chatroomService.create(chatroom));
        } else {
          console.error(`No user found with login ${recipientLogin}`);
        }
      },
      error: error => {
        console.error(`There was an error finding user by login ${recipientLogin}:`, error);
      },
    });
  }

  selectChatroom(chatroom: IChatroom): void {
    this.selectedChatroom = chatroom;
    // Since you now have the selected chatroom, you can also set up to load its messages here later
    // For now, let's just log the selected chatroom
    console.log('Selected Chatroom:', chatroom);
  }

  sendMessage(): void {
    if (this.selectedChatroom && this.account?.login && this.newMessageContent.trim()) {
      // Use the UserManagementService to find the user by login and get the ID
      this.userManagementService.find(this.account.login).subscribe({
        next: user => {
          // 'user' is already of type IUser, so no need for 'userResponse.body'
          if (user.id) {
            // Directly use 'user.id'
            const newMessage: NewChatMessage = {
              id: null,
              content: this.newMessageContent,
              timestamp: dayjs(),
              sender: { id: user.id }, // Use the ID from the user
              chatroom: { id: this.selectedChatroom.id },
            };

            this.chatMessageService.create(newMessage).subscribe({
              next: response => {
                console.log('Message sent:', response.body);
                this.newMessageContent = ''; // Clear the message input
                // Refresh messages or add to list
              },
              error: error => {
                console.error('Error sending message:', error);
              },
            });
          } else {
            console.error(`User with login ${this.account?.login} does not have an ID.`);
          }
        },
        error: error => {
          console.error('Error fetching user by login for message sending:', error);
        },
      });
    } else {
      console.error('Message content is empty or no chatroom/user is selected');
    }
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
