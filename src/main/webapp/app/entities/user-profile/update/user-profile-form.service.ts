import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUserProfile, NewUserProfile } from '../user-profile.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserProfile for edit and NewUserProfileFormGroupInput for create.
 */
type UserProfileFormGroupInput = IUserProfile | PartialWithRequiredKeyOf<NewUserProfile>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUserProfile | NewUserProfile> = Omit<T, 'lastSeen'> & {
  lastSeen?: string | null;
};

type UserProfileFormRawValue = FormValueOf<IUserProfile>;

type NewUserProfileFormRawValue = FormValueOf<NewUserProfile>;

type UserProfileFormDefaults = Pick<NewUserProfile, 'id' | 'lastSeen' | 'chatrooms'>;

type UserProfileFormGroupContent = {
  id: FormControl<UserProfileFormRawValue['id'] | NewUserProfile['id']>;
  firstName: FormControl<UserProfileFormRawValue['firstName']>;
  lastName: FormControl<UserProfileFormRawValue['lastName']>;
  profilePicture: FormControl<UserProfileFormRawValue['profilePicture']>;
  profilePictureContentType: FormControl<UserProfileFormRawValue['profilePictureContentType']>;
  lastSeen: FormControl<UserProfileFormRawValue['lastSeen']>;
  location: FormControl<UserProfileFormRawValue['location']>;
  privacy: FormControl<UserProfileFormRawValue['privacy']>;
  user: FormControl<UserProfileFormRawValue['user']>;
  chatrooms: FormControl<UserProfileFormRawValue['chatrooms']>;
};

export type UserProfileFormGroup = FormGroup<UserProfileFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserProfileFormService {
  createUserProfileFormGroup(userProfile: UserProfileFormGroupInput = { id: null }): UserProfileFormGroup {
    const userProfileRawValue = this.convertUserProfileToUserProfileRawValue({
      ...this.getFormDefaults(),
      ...userProfile,
    });
    return new FormGroup<UserProfileFormGroupContent>({
      id: new FormControl(
        { value: userProfileRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(userProfileRawValue.firstName),
      lastName: new FormControl(userProfileRawValue.lastName),
      profilePicture: new FormControl(userProfileRawValue.profilePicture),
      profilePictureContentType: new FormControl(userProfileRawValue.profilePictureContentType),
      lastSeen: new FormControl(userProfileRawValue.lastSeen),
      location: new FormControl(userProfileRawValue.location),
      privacy: new FormControl(userProfileRawValue.privacy, {
        validators: [Validators.required],
      }),
      user: new FormControl(userProfileRawValue.user),
      chatrooms: new FormControl(userProfileRawValue.chatrooms ?? []),
    });
  }

  getUserProfile(form: UserProfileFormGroup): IUserProfile | NewUserProfile {
    return this.convertUserProfileRawValueToUserProfile(form.getRawValue() as UserProfileFormRawValue | NewUserProfileFormRawValue);
  }

  resetForm(form: UserProfileFormGroup, userProfile: UserProfileFormGroupInput): void {
    const userProfileRawValue = this.convertUserProfileToUserProfileRawValue({ ...this.getFormDefaults(), ...userProfile });
    form.reset(
      {
        ...userProfileRawValue,
        id: { value: userProfileRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserProfileFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      lastSeen: currentTime,
      chatrooms: [],
    };
  }

  private convertUserProfileRawValueToUserProfile(
    rawUserProfile: UserProfileFormRawValue | NewUserProfileFormRawValue
  ): IUserProfile | NewUserProfile {
    return {
      ...rawUserProfile,
      lastSeen: dayjs(rawUserProfile.lastSeen, DATE_TIME_FORMAT),
    };
  }

  private convertUserProfileToUserProfileRawValue(
    userProfile: IUserProfile | (Partial<NewUserProfile> & UserProfileFormDefaults)
  ): UserProfileFormRawValue | PartialWithRequiredKeyOf<NewUserProfileFormRawValue> {
    return {
      ...userProfile,
      lastSeen: userProfile.lastSeen ? userProfile.lastSeen.format(DATE_TIME_FORMAT) : undefined,
      chatrooms: userProfile.chatrooms ?? [],
    };
  }
}
