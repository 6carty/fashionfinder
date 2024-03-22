import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChatMessageFormService } from './chat-message-form.service';
import { ChatMessageService } from '../service/chat-message.service';
import { IChatMessage } from '../chat-message.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IChatroom } from 'app/entities/chatroom/chatroom.model';
import { ChatroomService } from 'app/entities/chatroom/service/chatroom.service';

import { ChatMessageUpdateComponent } from './chat-message-update.component';

describe('ChatMessage Management Update Component', () => {
  let comp: ChatMessageUpdateComponent;
  let fixture: ComponentFixture<ChatMessageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chatMessageFormService: ChatMessageFormService;
  let chatMessageService: ChatMessageService;
  let userService: UserService;
  let chatroomService: ChatroomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChatMessageUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ChatMessageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChatMessageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chatMessageFormService = TestBed.inject(ChatMessageFormService);
    chatMessageService = TestBed.inject(ChatMessageService);
    userService = TestBed.inject(UserService);
    chatroomService = TestBed.inject(ChatroomService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const chatMessage: IChatMessage = { id: 456 };
      const sender: IUser = { id: 55890 };
      chatMessage.sender = sender;

      const userCollection: IUser[] = [{ id: 68126 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [sender];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chatMessage });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Chatroom query and add missing value', () => {
      const chatMessage: IChatMessage = { id: 456 };
      const chatroom: IChatroom = { id: 37307 };
      chatMessage.chatroom = chatroom;

      const chatroomCollection: IChatroom[] = [{ id: 3326 }];
      jest.spyOn(chatroomService, 'query').mockReturnValue(of(new HttpResponse({ body: chatroomCollection })));
      const additionalChatrooms = [chatroom];
      const expectedCollection: IChatroom[] = [...additionalChatrooms, ...chatroomCollection];
      jest.spyOn(chatroomService, 'addChatroomToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chatMessage });
      comp.ngOnInit();

      expect(chatroomService.query).toHaveBeenCalled();
      expect(chatroomService.addChatroomToCollectionIfMissing).toHaveBeenCalledWith(
        chatroomCollection,
        ...additionalChatrooms.map(expect.objectContaining)
      );
      expect(comp.chatroomsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const chatMessage: IChatMessage = { id: 456 };
      const sender: IUser = { id: 69626 };
      chatMessage.sender = sender;
      const chatroom: IChatroom = { id: 54454 };
      chatMessage.chatroom = chatroom;

      activatedRoute.data = of({ chatMessage });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(sender);
      expect(comp.chatroomsSharedCollection).toContain(chatroom);
      expect(comp.chatMessage).toEqual(chatMessage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChatMessage>>();
      const chatMessage = { id: 123 };
      jest.spyOn(chatMessageFormService, 'getChatMessage').mockReturnValue(chatMessage);
      jest.spyOn(chatMessageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chatMessage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chatMessage }));
      saveSubject.complete();

      // THEN
      expect(chatMessageFormService.getChatMessage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(chatMessageService.update).toHaveBeenCalledWith(expect.objectContaining(chatMessage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChatMessage>>();
      const chatMessage = { id: 123 };
      jest.spyOn(chatMessageFormService, 'getChatMessage').mockReturnValue({ id: null });
      jest.spyOn(chatMessageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chatMessage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chatMessage }));
      saveSubject.complete();

      // THEN
      expect(chatMessageFormService.getChatMessage).toHaveBeenCalled();
      expect(chatMessageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChatMessage>>();
      const chatMessage = { id: 123 };
      jest.spyOn(chatMessageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chatMessage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chatMessageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareChatroom', () => {
      it('Should forward to chatroomService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(chatroomService, 'compareChatroom');
        comp.compareChatroom(entity, entity2);
        expect(chatroomService.compareChatroom).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
