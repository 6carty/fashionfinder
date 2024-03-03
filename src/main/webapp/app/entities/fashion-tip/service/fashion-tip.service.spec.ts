import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFashionTip } from '../fashion-tip.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../fashion-tip.test-samples';

import { FashionTipService } from './fashion-tip.service';

const requireRestSample: IFashionTip = {
  ...sampleWithRequiredData,
};

describe('FashionTip Service', () => {
  let service: FashionTipService;
  let httpMock: HttpTestingController;
  let expectedResult: IFashionTip | IFashionTip[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FashionTipService);
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

    it('should create a FashionTip', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fashionTip = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(fashionTip).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FashionTip', () => {
      const fashionTip = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(fashionTip).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FashionTip', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FashionTip', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a FashionTip', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFashionTipToCollectionIfMissing', () => {
      it('should add a FashionTip to an empty array', () => {
        const fashionTip: IFashionTip = sampleWithRequiredData;
        expectedResult = service.addFashionTipToCollectionIfMissing([], fashionTip);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fashionTip);
      });

      it('should not add a FashionTip to an array that contains it', () => {
        const fashionTip: IFashionTip = sampleWithRequiredData;
        const fashionTipCollection: IFashionTip[] = [
          {
            ...fashionTip,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFashionTipToCollectionIfMissing(fashionTipCollection, fashionTip);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FashionTip to an array that doesn't contain it", () => {
        const fashionTip: IFashionTip = sampleWithRequiredData;
        const fashionTipCollection: IFashionTip[] = [sampleWithPartialData];
        expectedResult = service.addFashionTipToCollectionIfMissing(fashionTipCollection, fashionTip);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fashionTip);
      });

      it('should add only unique FashionTip to an array', () => {
        const fashionTipArray: IFashionTip[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const fashionTipCollection: IFashionTip[] = [sampleWithRequiredData];
        expectedResult = service.addFashionTipToCollectionIfMissing(fashionTipCollection, ...fashionTipArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const fashionTip: IFashionTip = sampleWithRequiredData;
        const fashionTip2: IFashionTip = sampleWithPartialData;
        expectedResult = service.addFashionTipToCollectionIfMissing([], fashionTip, fashionTip2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fashionTip);
        expect(expectedResult).toContain(fashionTip2);
      });

      it('should accept null and undefined values', () => {
        const fashionTip: IFashionTip = sampleWithRequiredData;
        expectedResult = service.addFashionTipToCollectionIfMissing([], null, fashionTip, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fashionTip);
      });

      it('should return initial array if no FashionTip is added', () => {
        const fashionTipCollection: IFashionTip[] = [sampleWithRequiredData];
        expectedResult = service.addFashionTipToCollectionIfMissing(fashionTipCollection, undefined, null);
        expect(expectedResult).toEqual(fashionTipCollection);
      });
    });

    describe('compareFashionTip', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFashionTip(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFashionTip(entity1, entity2);
        const compareResult2 = service.compareFashionTip(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFashionTip(entity1, entity2);
        const compareResult2 = service.compareFashionTip(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFashionTip(entity1, entity2);
        const compareResult2 = service.compareFashionTip(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
