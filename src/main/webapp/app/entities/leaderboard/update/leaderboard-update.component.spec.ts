import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LeaderboardFormService } from './leaderboard-form.service';
import { LeaderboardService } from '../service/leaderboard.service';
import { ILeaderboard } from '../leaderboard.model';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

import { LeaderboardUpdateComponent } from './leaderboard-update.component';

describe('Leaderboard Management Update Component', () => {
  let comp: LeaderboardUpdateComponent;
  let fixture: ComponentFixture<LeaderboardUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let leaderboardFormService: LeaderboardFormService;
  let leaderboardService: LeaderboardService;
  let postService: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LeaderboardUpdateComponent],
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
      .overrideTemplate(LeaderboardUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LeaderboardUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    leaderboardFormService = TestBed.inject(LeaderboardFormService);
    leaderboardService = TestBed.inject(LeaderboardService);
    postService = TestBed.inject(PostService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Post query and add missing value', () => {
      const leaderboard: ILeaderboard = { id: 456 };
      const post: IPost = { id: 35860 };
      leaderboard.post = post;

      const postCollection: IPost[] = [{ id: 23272 }];
      jest.spyOn(postService, 'query').mockReturnValue(of(new HttpResponse({ body: postCollection })));
      const additionalPosts = [post];
      const expectedCollection: IPost[] = [...additionalPosts, ...postCollection];
      jest.spyOn(postService, 'addPostToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ leaderboard });
      comp.ngOnInit();

      expect(postService.query).toHaveBeenCalled();
      expect(postService.addPostToCollectionIfMissing).toHaveBeenCalledWith(
        postCollection,
        ...additionalPosts.map(expect.objectContaining)
      );
      expect(comp.postsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const leaderboard: ILeaderboard = { id: 456 };
      const post: IPost = { id: 55243 };
      leaderboard.post = post;

      activatedRoute.data = of({ leaderboard });
      comp.ngOnInit();

      expect(comp.postsSharedCollection).toContain(post);
      expect(comp.leaderboard).toEqual(leaderboard);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILeaderboard>>();
      const leaderboard = { id: 123 };
      jest.spyOn(leaderboardFormService, 'getLeaderboard').mockReturnValue(leaderboard);
      jest.spyOn(leaderboardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leaderboard });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: leaderboard }));
      saveSubject.complete();

      // THEN
      expect(leaderboardFormService.getLeaderboard).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(leaderboardService.update).toHaveBeenCalledWith(expect.objectContaining(leaderboard));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILeaderboard>>();
      const leaderboard = { id: 123 };
      jest.spyOn(leaderboardFormService, 'getLeaderboard').mockReturnValue({ id: null });
      jest.spyOn(leaderboardService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leaderboard: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: leaderboard }));
      saveSubject.complete();

      // THEN
      expect(leaderboardFormService.getLeaderboard).toHaveBeenCalled();
      expect(leaderboardService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILeaderboard>>();
      const leaderboard = { id: 123 };
      jest.spyOn(leaderboardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leaderboard });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(leaderboardService.update).toHaveBeenCalled();
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
  });
});
