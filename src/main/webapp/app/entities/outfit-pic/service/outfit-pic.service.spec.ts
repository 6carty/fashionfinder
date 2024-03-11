import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOutfitPic } from '../outfit-pic.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../outfit-pic.test-samples';

import { OutfitPicService } from './outfit-pic.service';

const requireRestSample: IOutfitPic = {
  ...sampleWithRequiredData,
};

describe('OutfitPic Service', () => {
  let service: OutfitPicService;
  let httpMock: HttpTestingController;
  let expectedResult: IOutfitPic | IOutfitPic[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OutfitPicService);
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

    it('should create a OutfitPic', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const outfitPic = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(outfitPic).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OutfitPic', () => {
      const outfitPic = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(outfitPic).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OutfitPic', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OutfitPic', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a OutfitPic', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOutfitPicToCollectionIfMissing', () => {
      it('should add a OutfitPic to an empty array', () => {
        const outfitPic: IOutfitPic = sampleWithRequiredData;
        expectedResult = service.addOutfitPicToCollectionIfMissing([], outfitPic);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(outfitPic);
      });

      it('should not add a OutfitPic to an array that contains it', () => {
        const outfitPic: IOutfitPic = sampleWithRequiredData;
        const outfitPicCollection: IOutfitPic[] = [
          {
            ...outfitPic,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOutfitPicToCollectionIfMissing(outfitPicCollection, outfitPic);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OutfitPic to an array that doesn't contain it", () => {
        const outfitPic: IOutfitPic = sampleWithRequiredData;
        const outfitPicCollection: IOutfitPic[] = [sampleWithPartialData];
        expectedResult = service.addOutfitPicToCollectionIfMissing(outfitPicCollection, outfitPic);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(outfitPic);
      });

      it('should add only unique OutfitPic to an array', () => {
        const outfitPicArray: IOutfitPic[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const outfitPicCollection: IOutfitPic[] = [sampleWithRequiredData];
        expectedResult = service.addOutfitPicToCollectionIfMissing(outfitPicCollection, ...outfitPicArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const outfitPic: IOutfitPic = sampleWithRequiredData;
        const outfitPic2: IOutfitPic = sampleWithPartialData;
        expectedResult = service.addOutfitPicToCollectionIfMissing([], outfitPic, outfitPic2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(outfitPic);
        expect(expectedResult).toContain(outfitPic2);
      });

      it('should accept null and undefined values', () => {
        const outfitPic: IOutfitPic = sampleWithRequiredData;
        expectedResult = service.addOutfitPicToCollectionIfMissing([], null, outfitPic, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(outfitPic);
      });

      it('should return initial array if no OutfitPic is added', () => {
        const outfitPicCollection: IOutfitPic[] = [sampleWithRequiredData];
        expectedResult = service.addOutfitPicToCollectionIfMissing(outfitPicCollection, undefined, null);
        expect(expectedResult).toEqual(outfitPicCollection);
      });
    });

    describe('compareOutfitPic', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOutfitPic(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOutfitPic(entity1, entity2);
        const compareResult2 = service.compareOutfitPic(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOutfitPic(entity1, entity2);
        const compareResult2 = service.compareOutfitPic(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOutfitPic(entity1, entity2);
        const compareResult2 = service.compareOutfitPic(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
