import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserMilestone } from '../user-milestone.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-milestone.test-samples';

import { UserMilestoneService, RestUserMilestone } from './user-milestone.service';

const requireRestSample: RestUserMilestone = {
  ...sampleWithRequiredData,
  unlockedDate: sampleWithRequiredData.unlockedDate?.toJSON(),
};

describe('UserMilestone Service', () => {
  let service: UserMilestoneService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserMilestone | IUserMilestone[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserMilestoneService);
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

    it('should create a UserMilestone', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userMilestone = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userMilestone).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserMilestone', () => {
      const userMilestone = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userMilestone).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserMilestone', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserMilestone', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserMilestone', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserMilestoneToCollectionIfMissing', () => {
      it('should add a UserMilestone to an empty array', () => {
        const userMilestone: IUserMilestone = sampleWithRequiredData;
        expectedResult = service.addUserMilestoneToCollectionIfMissing([], userMilestone);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userMilestone);
      });

      it('should not add a UserMilestone to an array that contains it', () => {
        const userMilestone: IUserMilestone = sampleWithRequiredData;
        const userMilestoneCollection: IUserMilestone[] = [
          {
            ...userMilestone,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserMilestoneToCollectionIfMissing(userMilestoneCollection, userMilestone);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserMilestone to an array that doesn't contain it", () => {
        const userMilestone: IUserMilestone = sampleWithRequiredData;
        const userMilestoneCollection: IUserMilestone[] = [sampleWithPartialData];
        expectedResult = service.addUserMilestoneToCollectionIfMissing(userMilestoneCollection, userMilestone);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userMilestone);
      });

      it('should add only unique UserMilestone to an array', () => {
        const userMilestoneArray: IUserMilestone[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userMilestoneCollection: IUserMilestone[] = [sampleWithRequiredData];
        expectedResult = service.addUserMilestoneToCollectionIfMissing(userMilestoneCollection, ...userMilestoneArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userMilestone: IUserMilestone = sampleWithRequiredData;
        const userMilestone2: IUserMilestone = sampleWithPartialData;
        expectedResult = service.addUserMilestoneToCollectionIfMissing([], userMilestone, userMilestone2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userMilestone);
        expect(expectedResult).toContain(userMilestone2);
      });

      it('should accept null and undefined values', () => {
        const userMilestone: IUserMilestone = sampleWithRequiredData;
        expectedResult = service.addUserMilestoneToCollectionIfMissing([], null, userMilestone, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userMilestone);
      });

      it('should return initial array if no UserMilestone is added', () => {
        const userMilestoneCollection: IUserMilestone[] = [sampleWithRequiredData];
        expectedResult = service.addUserMilestoneToCollectionIfMissing(userMilestoneCollection, undefined, null);
        expect(expectedResult).toEqual(userMilestoneCollection);
      });
    });

    describe('compareUserMilestone', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserMilestone(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserMilestone(entity1, entity2);
        const compareResult2 = service.compareUserMilestone(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserMilestone(entity1, entity2);
        const compareResult2 = service.compareUserMilestone(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserMilestone(entity1, entity2);
        const compareResult2 = service.compareUserMilestone(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
