// In social-chat.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
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
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    text: string;
    timestamp: string;
    isSent: boolean;
    image?: string;
  }> = [];
  currentUserId: number | undefined;
  private pollingSubscription: Subscription | null = null;
  private readonly pollingInterval = 5000; // Poll every 5 seconds
  @ViewChild('messageContainer') private messageContainer: ElementRef | null = null;
  selectedImage: File | null = null;
  @ViewChild('fileInput') private fileInput?: ElementRef;
  isImageModalOpen = false;
  modalImageSrc = '';

  constructor(
    private accountService: AccountService,
    private changeDetectorRef: ChangeDetectorRef,
    private chatroomService: ChatroomService,
    private userManagementService: UserManagementService,
    private chatMessageService: ChatMessageService,
    private http: HttpClient
  ) {}

  fetchChatrooms(): void {
    this.chatroomsSubscription = this.chatroomService.query().subscribe(
      (response: HttpResponse<IChatroom[]>) => {
        const chatrooms = response.body || [];

        // Map chatrooms to an array of observables fetching user's logins
        const userLoginsRequests = chatrooms.map(chatroom => {
          const otherUserId = chatroom.creator?.id !== this.currentUserId ? chatroom.creator?.id : chatroom.recipient?.id;
          if (!otherUserId) {
            return of({ login: 'Unknown' }); // if there's no other user ID
          }
          return this.userManagementService.findUserById(otherUserId).pipe(catchError(() => of({ login: 'Unknown' }))); // in case of error, return 'Unknown'
        });

        forkJoin(userLoginsRequests).subscribe(users => {
          this.chatroomReceivedData = chatrooms.map((chatroom, index) => {
            // Use the other user's login as the chatroom name
            const otherUserLogin = users[index].login;
            return {
              ...chatroom,
              name: otherUserLogin || 'Unknown',
            };
          });
          this.changeDetectorRef.detectChanges(); // Trigger a view update
        });
      },
      error => {
        console.error('There was an error fetching chatrooms:', error);
      }
    );
  }

  onCreateChatroomButtonClick(): void {
    const recipientLoginElement = document.getElementById('recipientField') as HTMLInputElement;
    this.userInput3 = recipientLoginElement.value;

    if (this.account?.login) {
      // Find the ID of the currently logged-in user using their login
      this.userManagementService.find(this.account.login).subscribe(
        creatorUser => {
          if (creatorUser?.id != null) {
            this.findRecipientAndCreateChatroom('chatroom', creatorUser.id, this.userInput3);
          } else {
            console.error(`No user found with login ${this.account?.login}`);
          }
        },
        error => {
          console.error('Error finding the creator user by login:', error);
        }
      );
    } else {
      console.error('No account is currently logged in, or the account does not have a login.');
    }
  }

  findRecipientAndCreateChatroom(chatroomName: string, creatorId: number, recipientLogin: string): void {
    // Adjusted method to always set chatroom name to 'chatroom'
    this.userManagementService.find(recipientLogin).subscribe(
      recipientUser => {
        if (recipientUser?.id != null) {
          const chatroom: NewChatroom = {
            id: null,
            name: 'chatroom',
            creator: { id: creatorId },
            recipient: { id: recipientUser.id },
          };
          this.subscribeToSaveResponseChatroom(this.chatroomService.create(chatroom));
        } else {
          console.error(`No user found with login ${recipientLogin}`);
        }
      },
      error => {
        console.error(`Error finding user by login ${recipientLogin}:`, error);
      }
    );
  }

  selectChatroom(chatroom: IChatroom): void {
    this.selectedChatroom = chatroom;
    // Unsubscribe from any existing polling subscription
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
    // Fetch messages for the selected chatroom and start polling for new messages
    this.fetchMessages(chatroom.id);
    this.startPollingMessages(chatroom.id);
  }

  fetchMessages(chatroomId: number): void {
    this.chatMessageService.queryByChatroomId(chatroomId).subscribe(
      (res: HttpResponse<IChatMessage[]>) => {
        if (res.body) {
          this.messages = res.body
            .map(message => {
              let imageSrc;
              if (message.image && message.imageContentType) {
                imageSrc = `data:${message.imageContentType};base64,${message.image}`;
              }
              return {
                text: message.content || '',
                timestamp: message.timestamp ? dayjs(message.timestamp).format('HH:mm') : '',
                isSent: message.sender?.id === this.currentUserId,
                chatroomId: message.chatroom?.id,
                image: imageSrc || undefined,
              };
            })
            .filter(m => m.chatroomId === chatroomId);
        }
      },
      error => {
        console.error('There was an error fetching messages:', error);
      }
    );
  }

  sendMessage(): void {
    if (this.selectedChatroom && this.account?.login && this.newMessageContent.trim()) {
      this.userManagementService.find(this.account.login).subscribe({
        next: user => {
          if (user && user.id) {
            const newMessage: NewChatMessage = {
              id: null,
              content: this.newMessageContent,
              timestamp: dayjs(),
              sender: { id: user.id },
              chatroom: { id: this.selectedChatroom.id },
              image: null,
              imageContentType: null,
            };

            if (this.selectedImage) {
              const reader = new FileReader();
              reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                  newMessage.image = reader.result.split(',')[1]; // Base64 encoded string
                  newMessage.imageContentType = this.selectedImage?.type; // Image content type e.g., 'image/png'
                  this.sendImageMessage(newMessage);
                }
              };
              reader.readAsDataURL(this.selectedImage);
            } else {
              this.sendTextMessage(newMessage);
            }
          } else {
            console.error(`User with login ${this.account?.login} does not have an ID.`);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching user by login for message sending:', error.message);
        },
      });
    } else {
      console.error('Message content is empty or no chatroom/user is selected');
    }
  }

  sendImageMessage(newMessage: NewChatMessage): void {
    this.chatMessageService.create(newMessage).subscribe({
      next: () => {
        // Clear input fields after message is sent
        this.newMessageContent = '';
        this.selectedImage = null;
        if (this.fileInput) {
          this.fileInput.nativeElement.value = ''; // Clear the file input
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error sending message:', error.message);
      },
    });
  }

  sendTextMessage(newMessage: NewChatMessage): void {
    this.chatMessageService.create(newMessage).subscribe({
      next: response => {
        this.newMessageContent = '';
        this.changeDetectorRef.detectChanges(); // Manually trigger change detection
        const createdMessage = response.body;
        if (createdMessage) {
          this.messages.push({
            text: createdMessage.content || '',
            timestamp: dayjs(createdMessage.timestamp).format('HH:mm'),
            isSent: true,
            image: createdMessage.image ?? undefined,
          });
        }
        this.scrollToBottom();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error sending message:', error.message);
      },
    });
  }

  handleImageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];
    }
  }

  enlargeImage(imageSrc: string): void {
    window.open(imageSrc, '_blank');
  }

  startPollingMessages(chatroomId: number): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }

    // Setup polling to call fetchMessages every 5 seconds
    this.pollingSubscription = interval(this.pollingInterval)
      .pipe(startWith(0)) // Start immediately
      .subscribe(() => {
        this.fetchMessages(chatroomId);
      });
  }

  openImageModal(imageSrc: string): void {
    this.modalImageSrc = imageSrc;
    this.isImageModalOpen = true;
  }

  // Method to close the image modal
  closeImageModal(): void {
    this.isImageModalOpen = false;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.messageContainer) {
      try {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Could not scroll to bottom: ', err);
      }
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

  ngOnInit(): void {
    this.accountSubscription = this.accountService.identity().subscribe((account: Account | null) => {
      this.account = account;
      this.changeDetectorRef.detectChanges();

      if (account?.login) {
        this.userManagementService.find(account.login).subscribe(user => {
          this.currentUserId = user.id ?? undefined; // set to undefined if user.id is null
          // Now fetch chatrooms after the current user's ID is known
          this.fetchChatrooms();
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
