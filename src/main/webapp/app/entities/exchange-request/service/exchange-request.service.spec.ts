import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IExchangeRequest } from '../exchange-request.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../exchange-request.test-samples';

import { ExchangeRequestService } from './exchange-request.service';

const requireRestSample: IExchangeRequest = {
  ...sampleWithRequiredData,
};

describe('ExchangeRequest Service', () => {
  let service: ExchangeRequestService;
  let httpMock: HttpTestingController;
  let expectedResult: IExchangeRequest | IExchangeRequest[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExchangeRequestService);
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

    it('should create a ExchangeRequest', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const exchangeRequest = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(exchangeRequest).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ExchangeRequest', () => {
      const exchangeRequest = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(exchangeRequest).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ExchangeRequest', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ExchangeRequest', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ExchangeRequest', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addExchangeRequestToCollectionIfMissing', () => {
      it('should add a ExchangeRequest to an empty array', () => {
        const exchangeRequest: IExchangeRequest = sampleWithRequiredData;
        expectedResult = service.addExchangeRequestToCollectionIfMissing([], exchangeRequest);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exchangeRequest);
      });

      it('should not add a ExchangeRequest to an array that contains it', () => {
        const exchangeRequest: IExchangeRequest = sampleWithRequiredData;
        const exchangeRequestCollection: IExchangeRequest[] = [
          {
            ...exchangeRequest,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addExchangeRequestToCollectionIfMissing(exchangeRequestCollection, exchangeRequest);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExchangeRequest to an array that doesn't contain it", () => {
        const exchangeRequest: IExchangeRequest = sampleWithRequiredData;
        const exchangeRequestCollection: IExchangeRequest[] = [sampleWithPartialData];
        expectedResult = service.addExchangeRequestToCollectionIfMissing(exchangeRequestCollection, exchangeRequest);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exchangeRequest);
      });

      it('should add only unique ExchangeRequest to an array', () => {
        const exchangeRequestArray: IExchangeRequest[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const exchangeRequestCollection: IExchangeRequest[] = [sampleWithRequiredData];
        expectedResult = service.addExchangeRequestToCollectionIfMissing(exchangeRequestCollection, ...exchangeRequestArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const exchangeRequest: IExchangeRequest = sampleWithRequiredData;
        const exchangeRequest2: IExchangeRequest = sampleWithPartialData;
        expectedResult = service.addExchangeRequestToCollectionIfMissing([], exchangeRequest, exchangeRequest2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exchangeRequest);
        expect(expectedResult).toContain(exchangeRequest2);
      });

      it('should accept null and undefined values', () => {
        const exchangeRequest: IExchangeRequest = sampleWithRequiredData;
        expectedResult = service.addExchangeRequestToCollectionIfMissing([], null, exchangeRequest, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exchangeRequest);
      });

      it('should return initial array if no ExchangeRequest is added', () => {
        const exchangeRequestCollection: IExchangeRequest[] = [sampleWithRequiredData];
        expectedResult = service.addExchangeRequestToCollectionIfMissing(exchangeRequestCollection, undefined, null);
        expect(expectedResult).toEqual(exchangeRequestCollection);
      });
    });

    describe('compareExchangeRequest', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareExchangeRequest(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareExchangeRequest(entity1, entity2);
        const compareResult2 = service.compareExchangeRequest(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareExchangeRequest(entity1, entity2);
        const compareResult2 = service.compareExchangeRequest(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareExchangeRequest(entity1, entity2);
        const compareResult2 = service.compareExchangeRequest(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
