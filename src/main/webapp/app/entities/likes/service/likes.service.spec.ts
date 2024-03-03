import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILikes } from '../likes.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../likes.test-samples';

import { LikesService, RestLikes } from './likes.service';

const requireRestSample: RestLikes = {
  ...sampleWithRequiredData,
  likedAt: sampleWithRequiredData.likedAt?.toJSON(),
};

describe('Likes Service', () => {
  let service: LikesService;
  let httpMock: HttpTestingController;
  let expectedResult: ILikes | ILikes[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LikesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Likes', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const likes = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(likes).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Likes', () => {
      const likes = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(likes).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Likes', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Likes', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Likes', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLikesToCollectionIfMissing', () => {
      it('should add a Likes to an empty array', () => {
        const likes: ILikes = sampleWithRequiredData;
        expectedResult = service.addLikesToCollectionIfMissing([], likes);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(likes);
      });

      it('should not add a Likes to an array that contains it', () => {
        const likes: ILikes = sampleWithRequiredData;
        const likesCollection: ILikes[] = [
          {
            ...likes,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLikesToCollectionIfMissing(likesCollection, likes);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Likes to an array that doesn't contain it", () => {
        const likes: ILikes = sampleWithRequiredData;
        const likesCollection: ILikes[] = [sampleWithPartialData];
        expectedResult = service.addLikesToCollectionIfMissing(likesCollection, likes);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(likes);
      });

      it('should add only unique Likes to an array', () => {
        const likesArray: ILikes[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const likesCollection: ILikes[] = [sampleWithRequiredData];
        expectedResult = service.addLikesToCollectionIfMissing(likesCollection, ...likesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const likes: ILikes = sampleWithRequiredData;
        const likes2: ILikes = sampleWithPartialData;
        expectedResult = service.addLikesToCollectionIfMissing([], likes, likes2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(likes);
        expect(expectedResult).toContain(likes2);
      });

      it('should accept null and undefined values', () => {
        const likes: ILikes = sampleWithRequiredData;
        expectedResult = service.addLikesToCollectionIfMissing([], null, likes, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(likes);
      });

      it('should return initial array if no Likes is added', () => {
        const likesCollection: ILikes[] = [sampleWithRequiredData];
        expectedResult = service.addLikesToCollectionIfMissing(likesCollection, undefined, null);
        expect(expectedResult).toEqual(likesCollection);
      });
    });

    describe('compareLikes', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLikes(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLikes(entity1, entity2);
        const compareResult2 = service.compareLikes(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLikes(entity1, entity2);
        const compareResult2 = service.compareLikes(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLikes(entity1, entity2);
        const compareResult2 = service.compareLikes(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
