import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../chat-message.test-samples';

import { ChatMessageFormService } from './chat-message-form.service';

describe('ChatMessage Form Service', () => {
  let service: ChatMessageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatMessageFormService);
  });

  describe('Service methods', () => {
    describe('createChatMessageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createChatMessageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            content: expect.any(Object),
            timestamp: expect.any(Object),
            image: expect.any(Object),
            sender: expect.any(Object),
            chatroom: expect.any(Object),
          })
        );
      });

      it('passing IChatMessage should create a new form with FormGroup', () => {
        const formGroup = service.createChatMessageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            content: expect.any(Object),
            timestamp: expect.any(Object),
            image: expect.any(Object),
            sender: expect.any(Object),
            chatroom: expect.any(Object),
          })
        );
      });
    });

    describe('getChatMessage', () => {
      it('should return NewChatMessage for default ChatMessage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createChatMessageFormGroup(sampleWithNewData);

        const chatMessage = service.getChatMessage(formGroup) as any;

        expect(chatMessage).toMatchObject(sampleWithNewData);
      });

      it('should return NewChatMessage for empty ChatMessage initial value', () => {
        const formGroup = service.createChatMessageFormGroup();

        const chatMessage = service.getChatMessage(formGroup) as any;

        expect(chatMessage).toMatchObject({});
      });

      it('should return IChatMessage', () => {
        const formGroup = service.createChatMessageFormGroup(sampleWithRequiredData);

        const chatMessage = service.getChatMessage(formGroup) as any;

        expect(chatMessage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IChatMessage should not enable id FormControl', () => {
        const formGroup = service.createChatMessageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewChatMessage should disable id FormControl', () => {
        const formGroup = service.createChatMessageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
