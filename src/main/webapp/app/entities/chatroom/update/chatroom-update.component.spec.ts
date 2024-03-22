import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChatroomFormService } from './chatroom-form.service';
import { ChatroomService } from '../service/chatroom.service';
import { IChatroom } from '../chatroom.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ChatroomUpdateComponent } from './chatroom-update.component';

describe('Chatroom Management Update Component', () => {
  let comp: ChatroomUpdateComponent;
  let fixture: ComponentFixture<ChatroomUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chatroomFormService: ChatroomFormService;
  let chatroomService: ChatroomService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChatroomUpdateComponent],
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
      .overrideTemplate(ChatroomUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChatroomUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chatroomFormService = TestBed.inject(ChatroomFormService);
    chatroomService = TestBed.inject(ChatroomService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const chatroom: IChatroom = { id: 456 };
      const creator: IUser = { id: 82190 };
      chatroom.creator = creator;
      const recipient: IUser = { id: 81454 };
      chatroom.recipient = recipient;

      const userCollection: IUser[] = [{ id: 95584 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [creator, recipient];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chatroom });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const chatroom: IChatroom = { id: 456 };
      const creator: IUser = { id: 38546 };
      chatroom.creator = creator;
      const recipient: IUser = { id: 4646 };
      chatroom.recipient = recipient;

      activatedRoute.data = of({ chatroom });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(creator);
      expect(comp.usersSharedCollection).toContain(recipient);
      expect(comp.chatroom).toEqual(chatroom);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChatroom>>();
      const chatroom = { id: 123 };
      jest.spyOn(chatroomFormService, 'getChatroom').mockReturnValue(chatroom);
      jest.spyOn(chatroomService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chatroom });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chatroom }));
      saveSubject.complete();

      // THEN
      expect(chatroomFormService.getChatroom).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(chatroomService.update).toHaveBeenCalledWith(expect.objectContaining(chatroom));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChatroom>>();
      const chatroom = { id: 123 };
      jest.spyOn(chatroomFormService, 'getChatroom').mockReturnValue({ id: null });
      jest.spyOn(chatroomService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chatroom: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chatroom }));
      saveSubject.complete();

      // THEN
      expect(chatroomFormService.getChatroom).toHaveBeenCalled();
      expect(chatroomService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChatroom>>();
      const chatroom = { id: 123 };
      jest.spyOn(chatroomService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chatroom });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chatroomService.update).toHaveBeenCalled();
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
  });
});
