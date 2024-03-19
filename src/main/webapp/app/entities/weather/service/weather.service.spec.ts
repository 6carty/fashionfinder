import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IWeather } from '../weather.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../weather.test-samples';

import { WeatherService, RestWeather } from './weather.service';

const requireRestSample: RestWeather = {
  ...sampleWithRequiredData,
  datetime: sampleWithRequiredData.datetime?.toJSON(),
};

describe('Weather Service', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;
  let expectedResult: IWeather | IWeather[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(WeatherService);
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

    it('should create a Weather', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const weather = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(weather).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Weather', () => {
      const weather = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(weather).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Weather', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Weather', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Weather', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addWeatherToCollectionIfMissing', () => {
      it('should add a Weather to an empty array', () => {
        const weather: IWeather = sampleWithRequiredData;
        expectedResult = service.addWeatherToCollectionIfMissing([], weather);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(weather);
      });

      it('should not add a Weather to an array that contains it', () => {
        const weather: IWeather = sampleWithRequiredData;
        const weatherCollection: IWeather[] = [
          {
            ...weather,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addWeatherToCollectionIfMissing(weatherCollection, weather);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Weather to an array that doesn't contain it", () => {
        const weather: IWeather = sampleWithRequiredData;
        const weatherCollection: IWeather[] = [sampleWithPartialData];
        expectedResult = service.addWeatherToCollectionIfMissing(weatherCollection, weather);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(weather);
      });

      it('should add only unique Weather to an array', () => {
        const weatherArray: IWeather[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const weatherCollection: IWeather[] = [sampleWithRequiredData];
        expectedResult = service.addWeatherToCollectionIfMissing(weatherCollection, ...weatherArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const weather: IWeather = sampleWithRequiredData;
        const weather2: IWeather = sampleWithPartialData;
        expectedResult = service.addWeatherToCollectionIfMissing([], weather, weather2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(weather);
        expect(expectedResult).toContain(weather2);
      });

      it('should accept null and undefined values', () => {
        const weather: IWeather = sampleWithRequiredData;
        expectedResult = service.addWeatherToCollectionIfMissing([], null, weather, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(weather);
      });

      it('should return initial array if no Weather is added', () => {
        const weatherCollection: IWeather[] = [sampleWithRequiredData];
        expectedResult = service.addWeatherToCollectionIfMissing(weatherCollection, undefined, null);
        expect(expectedResult).toEqual(weatherCollection);
      });
    });

    describe('compareWeather', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareWeather(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareWeather(entity1, entity2);
        const compareResult2 = service.compareWeather(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareWeather(entity1, entity2);
        const compareResult2 = service.compareWeather(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareWeather(entity1, entity2);
        const compareResult2 = service.compareWeather(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
