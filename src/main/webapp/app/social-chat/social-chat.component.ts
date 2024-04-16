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
import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

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
  messages: Array<{
    text: string; // the message text
    timestamp: string; // the message timestamp formatted as a string
    isSent: boolean; // whether the message was sent by the current user
  }> = [];
  currentUserId: number | undefined;
  private pollingSubscription: Subscription | null = null;
  private readonly pollingInterval = 5000; // Poll every 5 seconds

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
    this.fetchMessages(chatroom.id);
    this.pollingSubscription?.unsubscribe(); // Stop any existing polling
    this.startPollingMessages(chatroom.id);

    // Stop previous polling if any
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }

    // Start polling for the selected chatroom
    this.startPollingMessages(chatroom.id);
  }

  fetchMessages(chatroomId: number): void {
    this.chatMessageService.queryByChatroomId(chatroomId).subscribe(
      (res: HttpResponse<IChatMessage[]>) => {
        if (res.body) {
          this.messages =
            res.body?.map(message => ({
              text: message.content || '',
              timestamp: message.timestamp ? dayjs(message.timestamp).format('HH:mm') : '',
              isSent: message.sender?.id === this.currentUserId,
            })) || [];

          console.log(this.messages);
        }
      },
      error => {
        console.error('There was an error fetching messages:', error);
      }
    );
  }

  sendMessage(): void {
    if (this.selectedChatroom && this.account?.login && this.newMessageContent.trim()) {
      // Use the UserManagementService to find the user by login and get the ID
      this.userManagementService.find(this.account.login).subscribe({
        next: user => {
          if (user.id) {
            const newMessage: NewChatMessage = {
              id: null,
              content: this.newMessageContent,
              timestamp: dayjs(),
              sender: { id: user.id }, // Use the ID from the user
              chatroom: { id: this.selectedChatroom.id },
            };

            this.chatMessageService.create(newMessage).subscribe({
              next: response => {
                this.newMessageContent = ''; // Clear the message input
                const createdMessage = response.body;
                if (createdMessage) {
                  this.messages.push({
                    text: createdMessage.content || '',
                    timestamp: createdMessage.timestamp ? dayjs(createdMessage.timestamp).format('HH:mm') : '',
                    isSent: true, // As the current user is the sender
                  });
                }
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

  startPollingMessages(chatroomId: number): void {
    this.pollingSubscription = interval(this.pollingInterval)
      .pipe(
        startWith(0),
        switchMap(() => this.chatMessageService.queryByChatroomId(chatroomId))
      )
      .subscribe(
        (res: HttpResponse<IChatMessage[]>) => {
          // Assuming that the backend service returns the messages sorted by timestamp
          this.messages =
            res.body?.map(message => ({
              text: message.content || '',
              timestamp: message.timestamp ? dayjs(message.timestamp).format('HH:mm') : '',
              isSent: message.sender?.id === this.currentUserId,
            })) || [];
        },
        error => {
          console.error('Error polling messages:', error);
        }
      );
  }

  appendSentMessage(message: IChatMessage): void {
    this.messages.push({
      text: message.content || '',
      timestamp: message.timestamp ? dayjs(message.timestamp).format('HH:mm') : '',
      isSent: true,
    });
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

  ngOnInit(): void {
    this.accountSubscription = this.accountService.identity().subscribe((account: Account | null) => {
      this.account = account;
      this.changeDetectorRef.detectChanges();
      this.fetchChatrooms();
    });

    this.accountService.identity().subscribe(account => {
      this.account = account;
      if (account?.login) {
        this.userManagementService.find(account.login).subscribe(user => {
          this.currentUserId = user.id ?? undefined; // set to undefined if user.id is null
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
    if (this.chatroomsSubscription) {
      this.chatroomsSubscription.unsubscribe();
    }
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}
