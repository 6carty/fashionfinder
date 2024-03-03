import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IChatroom, NewChatroom } from '../chatroom.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChatroom for edit and NewChatroomFormGroupInput for create.
 */
type ChatroomFormGroupInput = IChatroom | PartialWithRequiredKeyOf<NewChatroom>;

type ChatroomFormDefaults = Pick<NewChatroom, 'id' | 'userProfiles'>;

type ChatroomFormGroupContent = {
  id: FormControl<IChatroom['id'] | NewChatroom['id']>;
  name: FormControl<IChatroom['name']>;
  icon: FormControl<IChatroom['icon']>;
  iconContentType: FormControl<IChatroom['iconContentType']>;
  userProfiles: FormControl<IChatroom['userProfiles']>;
};

export type ChatroomFormGroup = FormGroup<ChatroomFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChatroomFormService {
  createChatroomFormGroup(chatroom: ChatroomFormGroupInput = { id: null }): ChatroomFormGroup {
    const chatroomRawValue = {
      ...this.getFormDefaults(),
      ...chatroom,
    };
    return new FormGroup<ChatroomFormGroupContent>({
      id: new FormControl(
        { value: chatroomRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(chatroomRawValue.name, {
        validators: [Validators.required],
      }),
      icon: new FormControl(chatroomRawValue.icon),
      iconContentType: new FormControl(chatroomRawValue.iconContentType),
      userProfiles: new FormControl(chatroomRawValue.userProfiles ?? []),
    });
  }

  getChatroom(form: ChatroomFormGroup): IChatroom | NewChatroom {
    return form.getRawValue() as IChatroom | NewChatroom;
  }

  resetForm(form: ChatroomFormGroup, chatroom: ChatroomFormGroupInput): void {
    const chatroomRawValue = { ...this.getFormDefaults(), ...chatroom };
    form.reset(
      {
        ...chatroomRawValue,
        id: { value: chatroomRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ChatroomFormDefaults {
    return {
      id: null,
      userProfiles: [],
    };
  }
}
