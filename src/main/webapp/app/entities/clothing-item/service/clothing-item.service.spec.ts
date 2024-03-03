import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IClothingItem } from '../clothing-item.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../clothing-item.test-samples';

import { ClothingItemService, RestClothingItem } from './clothing-item.service';

const requireRestSample: RestClothingItem = {
  ...sampleWithRequiredData,
  lastWorn: sampleWithRequiredData.lastWorn?.toJSON(),
};

describe('ClothingItem Service', () => {
  let service: ClothingItemService;
  let httpMock: HttpTestingController;
  let expectedResult: IClothingItem | IClothingItem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ClothingItemService);
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

    it('should create a ClothingItem', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const clothingItem = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(clothingItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ClothingItem', () => {
      const clothingItem = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(clothingItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ClothingItem', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ClothingItem', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ClothingItem', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addClothingItemToCollectionIfMissing', () => {
      it('should add a ClothingItem to an empty array', () => {
        const clothingItem: IClothingItem = sampleWithRequiredData;
        expectedResult = service.addClothingItemToCollectionIfMissing([], clothingItem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clothingItem);
      });

      it('should not add a ClothingItem to an array that contains it', () => {
        const clothingItem: IClothingItem = sampleWithRequiredData;
        const clothingItemCollection: IClothingItem[] = [
          {
            ...clothingItem,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addClothingItemToCollectionIfMissing(clothingItemCollection, clothingItem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ClothingItem to an array that doesn't contain it", () => {
        const clothingItem: IClothingItem = sampleWithRequiredData;
        const clothingItemCollection: IClothingItem[] = [sampleWithPartialData];
        expectedResult = service.addClothingItemToCollectionIfMissing(clothingItemCollection, clothingItem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clothingItem);
      });

      it('should add only unique ClothingItem to an array', () => {
        const clothingItemArray: IClothingItem[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const clothingItemCollection: IClothingItem[] = [sampleWithRequiredData];
        expectedResult = service.addClothingItemToCollectionIfMissing(clothingItemCollection, ...clothingItemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const clothingItem: IClothingItem = sampleWithRequiredData;
        const clothingItem2: IClothingItem = sampleWithPartialData;
        expectedResult = service.addClothingItemToCollectionIfMissing([], clothingItem, clothingItem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clothingItem);
        expect(expectedResult).toContain(clothingItem2);
      });

      it('should accept null and undefined values', () => {
        const clothingItem: IClothingItem = sampleWithRequiredData;
        expectedResult = service.addClothingItemToCollectionIfMissing([], null, clothingItem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clothingItem);
      });

      it('should return initial array if no ClothingItem is added', () => {
        const clothingItemCollection: IClothingItem[] = [sampleWithRequiredData];
        expectedResult = service.addClothingItemToCollectionIfMissing(clothingItemCollection, undefined, null);
        expect(expectedResult).toEqual(clothingItemCollection);
      });
    });

    describe('compareClothingItem', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareClothingItem(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareClothingItem(entity1, entity2);
        const compareResult2 = service.compareClothingItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareClothingItem(entity1, entity2);
        const compareResult2 = service.compareClothingItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareClothingItem(entity1, entity2);
        const compareResult2 = service.compareClothingItem(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
