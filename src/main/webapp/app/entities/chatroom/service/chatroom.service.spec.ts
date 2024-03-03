import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChatroom } from '../chatroom.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../chatroom.test-samples';

import { ChatroomService } from './chatroom.service';

const requireRestSample: IChatroom = {
  ...sampleWithRequiredData,
};

describe('Chatroom Service', () => {
  let service: ChatroomService;
  let httpMock: HttpTestingController;
  let expectedResult: IChatroom | IChatroom[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChatroomService);
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

    it('should create a Chatroom', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const chatroom = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(chatroom).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Chatroom', () => {
      const chatroom = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(chatroom).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Chatroom', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Chatroom', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Chatroom', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addChatroomToCollectionIfMissing', () => {
      it('should add a Chatroom to an empty array', () => {
        const chatroom: IChatroom = sampleWithRequiredData;
        expectedResult = service.addChatroomToCollectionIfMissing([], chatroom);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chatroom);
      });

      it('should not add a Chatroom to an array that contains it', () => {
        const chatroom: IChatroom = sampleWithRequiredData;
        const chatroomCollection: IChatroom[] = [
          {
            ...chatroom,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addChatroomToCollectionIfMissing(chatroomCollection, chatroom);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Chatroom to an array that doesn't contain it", () => {
        const chatroom: IChatroom = sampleWithRequiredData;
        const chatroomCollection: IChatroom[] = [sampleWithPartialData];
        expectedResult = service.addChatroomToCollectionIfMissing(chatroomCollection, chatroom);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chatroom);
      });

      it('should add only unique Chatroom to an array', () => {
        const chatroomArray: IChatroom[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const chatroomCollection: IChatroom[] = [sampleWithRequiredData];
        expectedResult = service.addChatroomToCollectionIfMissing(chatroomCollection, ...chatroomArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chatroom: IChatroom = sampleWithRequiredData;
        const chatroom2: IChatroom = sampleWithPartialData;
        expectedResult = service.addChatroomToCollectionIfMissing([], chatroom, chatroom2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chatroom);
        expect(expectedResult).toContain(chatroom2);
      });

      it('should accept null and undefined values', () => {
        const chatroom: IChatroom = sampleWithRequiredData;
        expectedResult = service.addChatroomToCollectionIfMissing([], null, chatroom, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chatroom);
      });

      it('should return initial array if no Chatroom is added', () => {
        const chatroomCollection: IChatroom[] = [sampleWithRequiredData];
        expectedResult = service.addChatroomToCollectionIfMissing(chatroomCollection, undefined, null);
        expect(expectedResult).toEqual(chatroomCollection);
      });
    });

    describe('compareChatroom', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareChatroom(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareChatroom(entity1, entity2);
        const compareResult2 = service.compareChatroom(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareChatroom(entity1, entity2);
        const compareResult2 = service.compareChatroom(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareChatroom(entity1, entity2);
        const compareResult2 = service.compareChatroom(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
