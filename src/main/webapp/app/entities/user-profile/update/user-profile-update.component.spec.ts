import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserProfileFormService } from './user-profile-form.service';
import { UserProfileService } from '../service/user-profile.service';
import { IUserProfile } from '../user-profile.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IChatroom } from 'app/entities/chatroom/chatroom.model';
import { ChatroomService } from 'app/entities/chatroom/service/chatroom.service';

import { UserProfileUpdateComponent } from './user-profile-update.component';

describe('UserProfile Management Update Component', () => {
  let comp: UserProfileUpdateComponent;
  let fixture: ComponentFixture<UserProfileUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userProfileFormService: UserProfileFormService;
  let userProfileService: UserProfileService;
  let userService: UserService;
  let chatroomService: ChatroomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserProfileUpdateComponent],
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
      .overrideTemplate(UserProfileUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserProfileUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userProfileFormService = TestBed.inject(UserProfileFormService);
    userProfileService = TestBed.inject(UserProfileService);
    userService = TestBed.inject(UserService);
    chatroomService = TestBed.inject(ChatroomService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userProfile: IUserProfile = { id: 456 };
      const user: IUser = { id: 28285 };
      userProfile.user = user;

      const userCollection: IUser[] = [{ id: 78135 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userProfile });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Chatroom query and add missing value', () => {
      const userProfile: IUserProfile = { id: 456 };
      const chatrooms: IChatroom[] = [{ id: 60909 }];
      userProfile.chatrooms = chatrooms;

      const chatroomCollection: IChatroom[] = [{ id: 17142 }];
      jest.spyOn(chatroomService, 'query').mockReturnValue(of(new HttpResponse({ body: chatroomCollection })));
      const additionalChatrooms = [...chatrooms];
      const expectedCollection: IChatroom[] = [...additionalChatrooms, ...chatroomCollection];
      jest.spyOn(chatroomService, 'addChatroomToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userProfile });
      comp.ngOnInit();

      expect(chatroomService.query).toHaveBeenCalled();
      expect(chatroomService.addChatroomToCollectionIfMissing).toHaveBeenCalledWith(
        chatroomCollection,
        ...additionalChatrooms.map(expect.objectContaining)
      );
      expect(comp.chatroomsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userProfile: IUserProfile = { id: 456 };
      const user: IUser = { id: 26285 };
      userProfile.user = user;
      const chatroom: IChatroom = { id: 55984 };
      userProfile.chatrooms = [chatroom];

      activatedRoute.data = of({ userProfile });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.chatroomsSharedCollection).toContain(chatroom);
      expect(comp.userProfile).toEqual(userProfile);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserProfile>>();
      const userProfile = { id: 123 };
      jest.spyOn(userProfileFormService, 'getUserProfile').mockReturnValue(userProfile);
      jest.spyOn(userProfileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userProfile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userProfile }));
      saveSubject.complete();

      // THEN
      expect(userProfileFormService.getUserProfile).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userProfileService.update).toHaveBeenCalledWith(expect.objectContaining(userProfile));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserProfile>>();
      const userProfile = { id: 123 };
      jest.spyOn(userProfileFormService, 'getUserProfile').mockReturnValue({ id: null });
      jest.spyOn(userProfileService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userProfile: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userProfile }));
      saveSubject.complete();

      // THEN
      expect(userProfileFormService.getUserProfile).toHaveBeenCalled();
      expect(userProfileService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserProfile>>();
      const userProfile = { id: 123 };
      jest.spyOn(userProfileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userProfile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userProfileService.update).toHaveBeenCalled();
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
