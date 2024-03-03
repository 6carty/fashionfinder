import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPurchaseListing } from '../purchase-listing.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../purchase-listing.test-samples';

import { PurchaseListingService } from './purchase-listing.service';

const requireRestSample: IPurchaseListing = {
  ...sampleWithRequiredData,
};

describe('PurchaseListing Service', () => {
  let service: PurchaseListingService;
  let httpMock: HttpTestingController;
  let expectedResult: IPurchaseListing | IPurchaseListing[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PurchaseListingService);
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

    it('should create a PurchaseListing', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const purchaseListing = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(purchaseListing).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PurchaseListing', () => {
      const purchaseListing = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(purchaseListing).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PurchaseListing', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PurchaseListing', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PurchaseListing', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPurchaseListingToCollectionIfMissing', () => {
      it('should add a PurchaseListing to an empty array', () => {
        const purchaseListing: IPurchaseListing = sampleWithRequiredData;
        expectedResult = service.addPurchaseListingToCollectionIfMissing([], purchaseListing);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(purchaseListing);
      });

      it('should not add a PurchaseListing to an array that contains it', () => {
        const purchaseListing: IPurchaseListing = sampleWithRequiredData;
        const purchaseListingCollection: IPurchaseListing[] = [
          {
            ...purchaseListing,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPurchaseListingToCollectionIfMissing(purchaseListingCollection, purchaseListing);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PurchaseListing to an array that doesn't contain it", () => {
        const purchaseListing: IPurchaseListing = sampleWithRequiredData;
        const purchaseListingCollection: IPurchaseListing[] = [sampleWithPartialData];
        expectedResult = service.addPurchaseListingToCollectionIfMissing(purchaseListingCollection, purchaseListing);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(purchaseListing);
      });

      it('should add only unique PurchaseListing to an array', () => {
        const purchaseListingArray: IPurchaseListing[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const purchaseListingCollection: IPurchaseListing[] = [sampleWithRequiredData];
        expectedResult = service.addPurchaseListingToCollectionIfMissing(purchaseListingCollection, ...purchaseListingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const purchaseListing: IPurchaseListing = sampleWithRequiredData;
        const purchaseListing2: IPurchaseListing = sampleWithPartialData;
        expectedResult = service.addPurchaseListingToCollectionIfMissing([], purchaseListing, purchaseListing2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(purchaseListing);
        expect(expectedResult).toContain(purchaseListing2);
      });

      it('should accept null and undefined values', () => {
        const purchaseListing: IPurchaseListing = sampleWithRequiredData;
        expectedResult = service.addPurchaseListingToCollectionIfMissing([], null, purchaseListing, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(purchaseListing);
      });

      it('should return initial array if no PurchaseListing is added', () => {
        const purchaseListingCollection: IPurchaseListing[] = [sampleWithRequiredData];
        expectedResult = service.addPurchaseListingToCollectionIfMissing(purchaseListingCollection, undefined, null);
        expect(expectedResult).toEqual(purchaseListingCollection);
      });
    });

    describe('comparePurchaseListing', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePurchaseListing(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePurchaseListing(entity1, entity2);
        const compareResult2 = service.comparePurchaseListing(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePurchaseListing(entity1, entity2);
        const compareResult2 = service.comparePurchaseListing(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePurchaseListing(entity1, entity2);
        const compareResult2 = service.comparePurchaseListing(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
