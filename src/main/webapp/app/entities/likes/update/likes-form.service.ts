import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILikes, NewLikes } from '../likes.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILikes for edit and NewLikesFormGroupInput for create.
 */
type LikesFormGroupInput = ILikes | PartialWithRequiredKeyOf<NewLikes>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ILikes | NewLikes> = Omit<T, 'likedAt'> & {
  likedAt?: string | null;
};

type LikesFormRawValue = FormValueOf<ILikes>;

type NewLikesFormRawValue = FormValueOf<NewLikes>;

type LikesFormDefaults = Pick<NewLikes, 'id' | 'like' | 'likedAt'>;

type LikesFormGroupContent = {
  id: FormControl<LikesFormRawValue['id'] | NewLikes['id']>;
  like: FormControl<LikesFormRawValue['like']>;
  likedAt: FormControl<LikesFormRawValue['likedAt']>;
  post: FormControl<LikesFormRawValue['post']>;
  userLiked: FormControl<LikesFormRawValue['userLiked']>;
};

export type LikesFormGroup = FormGroup<LikesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LikesFormService {
  createLikesFormGroup(likes: LikesFormGroupInput = { id: null }): LikesFormGroup {
    const likesRawValue = this.convertLikesToLikesRawValue({
      ...this.getFormDefaults(),
      ...likes,
    });
    return new FormGroup<LikesFormGroupContent>({
      id: new FormControl(
        { value: likesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      like: new FormControl(likesRawValue.like),
      likedAt: new FormControl(likesRawValue.likedAt),
      post: new FormControl(likesRawValue.post),
      userLiked: new FormControl(likesRawValue.userLiked),
    });
  }

  getLikes(form: LikesFormGroup): ILikes | NewLikes {
    return this.convertLikesRawValueToLikes(form.getRawValue() as LikesFormRawValue | NewLikesFormRawValue);
  }

  resetForm(form: LikesFormGroup, likes: LikesFormGroupInput): void {
    const likesRawValue = this.convertLikesToLikesRawValue({ ...this.getFormDefaults(), ...likes });
    form.reset(
      {
        ...likesRawValue,
        id: { value: likesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LikesFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      like: false,
      likedAt: currentTime,
    };
  }

  private convertLikesRawValueToLikes(rawLikes: LikesFormRawValue | NewLikesFormRawValue): ILikes | NewLikes {
    return {
      ...rawLikes,
      likedAt: dayjs(rawLikes.likedAt, DATE_TIME_FORMAT),
    };
  }

  private convertLikesToLikesRawValue(
    likes: ILikes | (Partial<NewLikes> & LikesFormDefaults)
  ): LikesFormRawValue | PartialWithRequiredKeyOf<NewLikesFormRawValue> {
    return {
      ...likes,
      likedAt: likes.likedAt ? likes.likedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
