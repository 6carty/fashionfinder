import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITrendingOutfit } from '../trending-outfit.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../trending-outfit.test-samples';

import { TrendingOutfitService } from './trending-outfit.service';

const requireRestSample: ITrendingOutfit = {
  ...sampleWithRequiredData,
};

describe('TrendingOutfit Service', () => {
  let service: TrendingOutfitService;
  let httpMock: HttpTestingController;
  let expectedResult: ITrendingOutfit | ITrendingOutfit[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TrendingOutfitService);
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

    it('should create a TrendingOutfit', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const trendingOutfit = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(trendingOutfit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TrendingOutfit', () => {
      const trendingOutfit = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(trendingOutfit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TrendingOutfit', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TrendingOutfit', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TrendingOutfit', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTrendingOutfitToCollectionIfMissing', () => {
      it('should add a TrendingOutfit to an empty array', () => {
        const trendingOutfit: ITrendingOutfit = sampleWithRequiredData;
        expectedResult = service.addTrendingOutfitToCollectionIfMissing([], trendingOutfit);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(trendingOutfit);
      });

      it('should not add a TrendingOutfit to an array that contains it', () => {
        const trendingOutfit: ITrendingOutfit = sampleWithRequiredData;
        const trendingOutfitCollection: ITrendingOutfit[] = [
          {
            ...trendingOutfit,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTrendingOutfitToCollectionIfMissing(trendingOutfitCollection, trendingOutfit);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TrendingOutfit to an array that doesn't contain it", () => {
        const trendingOutfit: ITrendingOutfit = sampleWithRequiredData;
        const trendingOutfitCollection: ITrendingOutfit[] = [sampleWithPartialData];
        expectedResult = service.addTrendingOutfitToCollectionIfMissing(trendingOutfitCollection, trendingOutfit);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(trendingOutfit);
      });

      it('should add only unique TrendingOutfit to an array', () => {
        const trendingOutfitArray: ITrendingOutfit[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const trendingOutfitCollection: ITrendingOutfit[] = [sampleWithRequiredData];
        expectedResult = service.addTrendingOutfitToCollectionIfMissing(trendingOutfitCollection, ...trendingOutfitArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const trendingOutfit: ITrendingOutfit = sampleWithRequiredData;
        const trendingOutfit2: ITrendingOutfit = sampleWithPartialData;
        expectedResult = service.addTrendingOutfitToCollectionIfMissing([], trendingOutfit, trendingOutfit2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(trendingOutfit);
        expect(expectedResult).toContain(trendingOutfit2);
      });

      it('should accept null and undefined values', () => {
        const trendingOutfit: ITrendingOutfit = sampleWithRequiredData;
        expectedResult = service.addTrendingOutfitToCollectionIfMissing([], null, trendingOutfit, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(trendingOutfit);
      });

      it('should return initial array if no TrendingOutfit is added', () => {
        const trendingOutfitCollection: ITrendingOutfit[] = [sampleWithRequiredData];
        expectedResult = service.addTrendingOutfitToCollectionIfMissing(trendingOutfitCollection, undefined, null);
        expect(expectedResult).toEqual(trendingOutfitCollection);
      });
    });

    describe('compareTrendingOutfit', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTrendingOutfit(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTrendingOutfit(entity1, entity2);
        const compareResult2 = service.compareTrendingOutfit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTrendingOutfit(entity1, entity2);
        const compareResult2 = service.compareTrendingOutfit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTrendingOutfit(entity1, entity2);
        const compareResult2 = service.compareTrendingOutfit(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
