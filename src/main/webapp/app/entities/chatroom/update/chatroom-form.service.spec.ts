import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../chatroom.test-samples';

import { ChatroomFormService } from './chatroom-form.service';

describe('Chatroom Form Service', () => {
  let service: ChatroomFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatroomFormService);
  });

  describe('Service methods', () => {
    describe('createChatroomFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createChatroomFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            creator: expect.any(Object),
            recipient: expect.any(Object),
          })
        );
      });

      it('passing IChatroom should create a new form with FormGroup', () => {
        const formGroup = service.createChatroomFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            creator: expect.any(Object),
            recipient: expect.any(Object),
          })
        );
      });
    });

    describe('getChatroom', () => {
      it('should return NewChatroom for default Chatroom initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createChatroomFormGroup(sampleWithNewData);

        const chatroom = service.getChatroom(formGroup) as any;

        expect(chatroom).toMatchObject(sampleWithNewData);
      });

      it('should return NewChatroom for empty Chatroom initial value', () => {
        const formGroup = service.createChatroomFormGroup();

        const chatroom = service.getChatroom(formGroup) as any;

        expect(chatroom).toMatchObject({});
      });

      it('should return IChatroom', () => {
        const formGroup = service.createChatroomFormGroup(sampleWithRequiredData);

        const chatroom = service.getChatroom(formGroup) as any;

        expect(chatroom).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IChatroom should not enable id FormControl', () => {
        const formGroup = service.createChatroomFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewChatroom should disable id FormControl', () => {
        const formGroup = service.createChatroomFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
