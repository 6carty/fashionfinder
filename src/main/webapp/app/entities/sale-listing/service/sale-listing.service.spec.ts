import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISaleListing } from '../sale-listing.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../sale-listing.test-samples';

import { SaleListingService } from './sale-listing.service';

const requireRestSample: ISaleListing = {
  ...sampleWithRequiredData,
};

describe('SaleListing Service', () => {
  let service: SaleListingService;
  let httpMock: HttpTestingController;
  let expectedResult: ISaleListing | ISaleListing[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SaleListingService);
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

    it('should create a SaleListing', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const saleListing = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(saleListing).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SaleListing', () => {
      const saleListing = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(saleListing).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SaleListing', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SaleListing', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SaleListing', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSaleListingToCollectionIfMissing', () => {
      it('should add a SaleListing to an empty array', () => {
        const saleListing: ISaleListing = sampleWithRequiredData;
        expectedResult = service.addSaleListingToCollectionIfMissing([], saleListing);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(saleListing);
      });

      it('should not add a SaleListing to an array that contains it', () => {
        const saleListing: ISaleListing = sampleWithRequiredData;
        const saleListingCollection: ISaleListing[] = [
          {
            ...saleListing,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSaleListingToCollectionIfMissing(saleListingCollection, saleListing);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SaleListing to an array that doesn't contain it", () => {
        const saleListing: ISaleListing = sampleWithRequiredData;
        const saleListingCollection: ISaleListing[] = [sampleWithPartialData];
        expectedResult = service.addSaleListingToCollectionIfMissing(saleListingCollection, saleListing);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(saleListing);
      });

      it('should add only unique SaleListing to an array', () => {
        const saleListingArray: ISaleListing[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const saleListingCollection: ISaleListing[] = [sampleWithRequiredData];
        expectedResult = service.addSaleListingToCollectionIfMissing(saleListingCollection, ...saleListingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const saleListing: ISaleListing = sampleWithRequiredData;
        const saleListing2: ISaleListing = sampleWithPartialData;
        expectedResult = service.addSaleListingToCollectionIfMissing([], saleListing, saleListing2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(saleListing);
        expect(expectedResult).toContain(saleListing2);
      });

      it('should accept null and undefined values', () => {
        const saleListing: ISaleListing = sampleWithRequiredData;
        expectedResult = service.addSaleListingToCollectionIfMissing([], null, saleListing, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(saleListing);
      });

      it('should return initial array if no SaleListing is added', () => {
        const saleListingCollection: ISaleListing[] = [sampleWithRequiredData];
        expectedResult = service.addSaleListingToCollectionIfMissing(saleListingCollection, undefined, null);
        expect(expectedResult).toEqual(saleListingCollection);
      });
    });

    describe('compareSaleListing', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSaleListing(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSaleListing(entity1, entity2);
        const compareResult2 = service.compareSaleListing(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSaleListing(entity1, entity2);
        const compareResult2 = service.compareSaleListing(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSaleListing(entity1, entity2);
        const compareResult2 = service.compareSaleListing(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
