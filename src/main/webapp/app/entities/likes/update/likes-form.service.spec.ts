import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../likes.test-samples';

import { LikesFormService } from './likes-form.service';

describe('Likes Form Service', () => {
  let service: LikesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikesFormService);
  });

  describe('Service methods', () => {
    describe('createLikesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLikesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            like: expect.any(Object),
            likedAt: expect.any(Object),
            post: expect.any(Object),
            userLiked: expect.any(Object),
          })
        );
      });

      it('passing ILikes should create a new form with FormGroup', () => {
        const formGroup = service.createLikesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            like: expect.any(Object),
            likedAt: expect.any(Object),
            post: expect.any(Object),
            userLiked: expect.any(Object),
          })
        );
      });
    });

    describe('getLikes', () => {
      it('should return NewLikes for default Likes initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLikesFormGroup(sampleWithNewData);

        const likes = service.getLikes(formGroup) as any;

        expect(likes).toMatchObject(sampleWithNewData);
      });

      it('should return NewLikes for empty Likes initial value', () => {
        const formGroup = service.createLikesFormGroup();

        const likes = service.getLikes(formGroup) as any;

        expect(likes).toMatchObject({});
      });

      it('should return ILikes', () => {
        const formGroup = service.createLikesFormGroup(sampleWithRequiredData);

        const likes = service.getLikes(formGroup) as any;

        expect(likes).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILikes should not enable id FormControl', () => {
        const formGroup = service.createLikesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLikes should disable id FormControl', () => {
        const formGroup = service.createLikesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
