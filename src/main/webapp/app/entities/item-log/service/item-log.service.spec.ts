import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IItemLog } from '../item-log.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../item-log.test-samples';

import { ItemLogService, RestItemLog } from './item-log.service';

const requireRestSample: RestItemLog = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('ItemLog Service', () => {
  let service: ItemLogService;
  let httpMock: HttpTestingController;
  let expectedResult: IItemLog | IItemLog[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ItemLogService);
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

    it('should create a ItemLog', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const itemLog = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(itemLog).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ItemLog', () => {
      const itemLog = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(itemLog).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ItemLog', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ItemLog', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ItemLog', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addItemLogToCollectionIfMissing', () => {
      it('should add a ItemLog to an empty array', () => {
        const itemLog: IItemLog = sampleWithRequiredData;
        expectedResult = service.addItemLogToCollectionIfMissing([], itemLog);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemLog);
      });

      it('should not add a ItemLog to an array that contains it', () => {
        const itemLog: IItemLog = sampleWithRequiredData;
        const itemLogCollection: IItemLog[] = [
          {
            ...itemLog,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addItemLogToCollectionIfMissing(itemLogCollection, itemLog);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ItemLog to an array that doesn't contain it", () => {
        const itemLog: IItemLog = sampleWithRequiredData;
        const itemLogCollection: IItemLog[] = [sampleWithPartialData];
        expectedResult = service.addItemLogToCollectionIfMissing(itemLogCollection, itemLog);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemLog);
      });

      it('should add only unique ItemLog to an array', () => {
        const itemLogArray: IItemLog[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const itemLogCollection: IItemLog[] = [sampleWithRequiredData];
        expectedResult = service.addItemLogToCollectionIfMissing(itemLogCollection, ...itemLogArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const itemLog: IItemLog = sampleWithRequiredData;
        const itemLog2: IItemLog = sampleWithPartialData;
        expectedResult = service.addItemLogToCollectionIfMissing([], itemLog, itemLog2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemLog);
        expect(expectedResult).toContain(itemLog2);
      });

      it('should accept null and undefined values', () => {
        const itemLog: IItemLog = sampleWithRequiredData;
        expectedResult = service.addItemLogToCollectionIfMissing([], null, itemLog, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemLog);
      });

      it('should return initial array if no ItemLog is added', () => {
        const itemLogCollection: IItemLog[] = [sampleWithRequiredData];
        expectedResult = service.addItemLogToCollectionIfMissing(itemLogCollection, undefined, null);
        expect(expectedResult).toEqual(itemLogCollection);
      });
    });

    describe('compareItemLog', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareItemLog(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareItemLog(entity1, entity2);
        const compareResult2 = service.compareItemLog(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareItemLog(entity1, entity2);
        const compareResult2 = service.compareItemLog(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareItemLog(entity1, entity2);
        const compareResult2 = service.compareItemLog(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
