import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LikesFormService } from './likes-form.service';
import { LikesService } from '../service/likes.service';
import { ILikes } from '../likes.model';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { LikesUpdateComponent } from './likes-update.component';

describe('Likes Management Update Component', () => {
  let comp: LikesUpdateComponent;
  let fixture: ComponentFixture<LikesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let likesFormService: LikesFormService;
  let likesService: LikesService;
  let postService: PostService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LikesUpdateComponent],
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
      .overrideTemplate(LikesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LikesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    likesFormService = TestBed.inject(LikesFormService);
    likesService = TestBed.inject(LikesService);
    postService = TestBed.inject(PostService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Post query and add missing value', () => {
      const likes: ILikes = { id: 456 };
      const post: IPost = { id: 15814 };
      likes.post = post;

      const postCollection: IPost[] = [{ id: 23944 }];
      jest.spyOn(postService, 'query').mockReturnValue(of(new HttpResponse({ body: postCollection })));
      const additionalPosts = [post];
      const expectedCollection: IPost[] = [...additionalPosts, ...postCollection];
      jest.spyOn(postService, 'addPostToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ likes });
      comp.ngOnInit();

      expect(postService.query).toHaveBeenCalled();
      expect(postService.addPostToCollectionIfMissing).toHaveBeenCalledWith(
        postCollection,
        ...additionalPosts.map(expect.objectContaining)
      );
      expect(comp.postsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserProfile query and add missing value', () => {
      const likes: ILikes = { id: 456 };
      const userLiked: IUserProfile = { id: 94982 };
      likes.userLiked = userLiked;

      const userProfileCollection: IUserProfile[] = [{ id: 59946 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [userLiked];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ likes });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const likes: ILikes = { id: 456 };
      const post: IPost = { id: 21113 };
      likes.post = post;
      const userLiked: IUserProfile = { id: 70377 };
      likes.userLiked = userLiked;

      activatedRoute.data = of({ likes });
      comp.ngOnInit();

      expect(comp.postsSharedCollection).toContain(post);
      expect(comp.userProfilesSharedCollection).toContain(userLiked);
      expect(comp.likes).toEqual(likes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILikes>>();
      const likes = { id: 123 };
      jest.spyOn(likesFormService, 'getLikes').mockReturnValue(likes);
      jest.spyOn(likesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ likes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: likes }));
      saveSubject.complete();

      // THEN
      expect(likesFormService.getLikes).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(likesService.update).toHaveBeenCalledWith(expect.objectContaining(likes));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILikes>>();
      const likes = { id: 123 };
      jest.spyOn(likesFormService, 'getLikes').mockReturnValue({ id: null });
      jest.spyOn(likesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ likes: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: likes }));
      saveSubject.complete();

      // THEN
      expect(likesFormService.getLikes).toHaveBeenCalled();
      expect(likesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILikes>>();
      const likes = { id: 123 };
      jest.spyOn(likesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ likes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(likesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePost', () => {
      it('Should forward to postService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(postService, 'comparePost');
        comp.comparePost(entity, entity2);
        expect(postService.comparePost).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUserProfile', () => {
      it('Should forward to userProfileService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userProfileService, 'compareUserProfile');
        comp.compareUserProfile(entity, entity2);
        expect(userProfileService.compareUserProfile).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
