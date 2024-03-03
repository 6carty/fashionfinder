import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOutfit } from '../outfit.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../outfit.test-samples';

import { OutfitService, RestOutfit } from './outfit.service';

const requireRestSample: RestOutfit = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('Outfit Service', () => {
  let service: OutfitService;
  let httpMock: HttpTestingController;
  let expectedResult: IOutfit | IOutfit[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OutfitService);
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

    it('should create a Outfit', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const outfit = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(outfit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Outfit', () => {
      const outfit = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(outfit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Outfit', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Outfit', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Outfit', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOutfitToCollectionIfMissing', () => {
      it('should add a Outfit to an empty array', () => {
        const outfit: IOutfit = sampleWithRequiredData;
        expectedResult = service.addOutfitToCollectionIfMissing([], outfit);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(outfit);
      });

      it('should not add a Outfit to an array that contains it', () => {
        const outfit: IOutfit = sampleWithRequiredData;
        const outfitCollection: IOutfit[] = [
          {
            ...outfit,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOutfitToCollectionIfMissing(outfitCollection, outfit);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Outfit to an array that doesn't contain it", () => {
        const outfit: IOutfit = sampleWithRequiredData;
        const outfitCollection: IOutfit[] = [sampleWithPartialData];
        expectedResult = service.addOutfitToCollectionIfMissing(outfitCollection, outfit);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(outfit);
      });

      it('should add only unique Outfit to an array', () => {
        const outfitArray: IOutfit[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const outfitCollection: IOutfit[] = [sampleWithRequiredData];
        expectedResult = service.addOutfitToCollectionIfMissing(outfitCollection, ...outfitArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const outfit: IOutfit = sampleWithRequiredData;
        const outfit2: IOutfit = sampleWithPartialData;
        expectedResult = service.addOutfitToCollectionIfMissing([], outfit, outfit2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(outfit);
        expect(expectedResult).toContain(outfit2);
      });

      it('should accept null and undefined values', () => {
        const outfit: IOutfit = sampleWithRequiredData;
        expectedResult = service.addOutfitToCollectionIfMissing([], null, outfit, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(outfit);
      });

      it('should return initial array if no Outfit is added', () => {
        const outfitCollection: IOutfit[] = [sampleWithRequiredData];
        expectedResult = service.addOutfitToCollectionIfMissing(outfitCollection, undefined, null);
        expect(expectedResult).toEqual(outfitCollection);
      });
    });

    describe('compareOutfit', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOutfit(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOutfit(entity1, entity2);
        const compareResult2 = service.compareOutfit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOutfit(entity1, entity2);
        const compareResult2 = service.compareOutfit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOutfit(entity1, entity2);
        const compareResult2 = service.compareOutfit(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
