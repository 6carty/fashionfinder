import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IChatMessage, NewChatMessage } from '../chat-message.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChatMessage for edit and NewChatMessageFormGroupInput for create.
 */
type ChatMessageFormGroupInput = IChatMessage | PartialWithRequiredKeyOf<NewChatMessage>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IChatMessage | NewChatMessage> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

type ChatMessageFormRawValue = FormValueOf<IChatMessage>;

type NewChatMessageFormRawValue = FormValueOf<NewChatMessage>;

type ChatMessageFormDefaults = Pick<NewChatMessage, 'id' | 'timestamp'>;

type ChatMessageFormGroupContent = {
  id: FormControl<ChatMessageFormRawValue['id'] | NewChatMessage['id']>;
  content: FormControl<ChatMessageFormRawValue['content']>;
  timestamp: FormControl<ChatMessageFormRawValue['timestamp']>;
  image: FormControl<ChatMessageFormRawValue['image']>;
  imageContentType: FormControl<ChatMessageFormRawValue['imageContentType']>;
  sender: FormControl<ChatMessageFormRawValue['sender']>;
  chatroom: FormControl<ChatMessageFormRawValue['chatroom']>;
};

export type ChatMessageFormGroup = FormGroup<ChatMessageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChatMessageFormService {
  createChatMessageFormGroup(chatMessage: ChatMessageFormGroupInput = { id: null }): ChatMessageFormGroup {
    const chatMessageRawValue = this.convertChatMessageToChatMessageRawValue({
      ...this.getFormDefaults(),
      ...chatMessage,
    });
    return new FormGroup<ChatMessageFormGroupContent>({
      id: new FormControl(
        { value: chatMessageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      content: new FormControl(chatMessageRawValue.content, {
        validators: [Validators.required],
      }),
      timestamp: new FormControl(chatMessageRawValue.timestamp, {
        validators: [Validators.required],
      }),
      image: new FormControl(chatMessageRawValue.image),
      imageContentType: new FormControl(chatMessageRawValue.imageContentType),
      sender: new FormControl(chatMessageRawValue.sender),
      chatroom: new FormControl(chatMessageRawValue.chatroom),
    });
  }

  getChatMessage(form: ChatMessageFormGroup): IChatMessage | NewChatMessage {
    return this.convertChatMessageRawValueToChatMessage(form.getRawValue() as ChatMessageFormRawValue | NewChatMessageFormRawValue);
  }

  resetForm(form: ChatMessageFormGroup, chatMessage: ChatMessageFormGroupInput): void {
    const chatMessageRawValue = this.convertChatMessageToChatMessageRawValue({ ...this.getFormDefaults(), ...chatMessage });
    form.reset(
      {
        ...chatMessageRawValue,
        id: { value: chatMessageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ChatMessageFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timestamp: currentTime,
    };
  }

  private convertChatMessageRawValueToChatMessage(
    rawChatMessage: ChatMessageFormRawValue | NewChatMessageFormRawValue
  ): IChatMessage | NewChatMessage {
    return {
      ...rawChatMessage,
      timestamp: dayjs(rawChatMessage.timestamp, DATE_TIME_FORMAT),
    };
  }

  private convertChatMessageToChatMessageRawValue(
    chatMessage: IChatMessage | (Partial<NewChatMessage> & ChatMessageFormDefaults)
  ): ChatMessageFormRawValue | PartialWithRequiredKeyOf<NewChatMessageFormRawValue> {
    return {
      ...chatMessage,
      timestamp: chatMessage.timestamp ? chatMessage.timestamp.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
