import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPost, NewPost } from '../post.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPost for edit and NewPostFormGroupInput for create.
 */
type PostFormGroupInput = IPost | PartialWithRequiredKeyOf<NewPost>;

type PostFormDefaults = Pick<NewPost, 'id'>;

type PostFormGroupContent = {
  id: FormControl<IPost['id'] | NewPost['id']>;
  caption: FormControl<IPost['caption']>;
  image: FormControl<IPost['image']>;
  imageContentType: FormControl<IPost['imageContentType']>;
  createdDate: FormControl<IPost['createdDate']>;
  editedDate: FormControl<IPost['editedDate']>;
  totalLikes: FormControl<IPost['totalLikes']>;
  author: FormControl<IPost['author']>;
};

export type PostFormGroup = FormGroup<PostFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PostFormService {
  createPostFormGroup(post: PostFormGroupInput = { id: null }): PostFormGroup {
    const postRawValue = {
      ...this.getFormDefaults(),
      ...post,
    };
    return new FormGroup<PostFormGroupContent>({
      id: new FormControl(
        { value: postRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      caption: new FormControl(postRawValue.caption, {
        validators: [Validators.required],
      }),
      image: new FormControl(postRawValue.image),
      imageContentType: new FormControl(postRawValue.imageContentType),
      createdDate: new FormControl(postRawValue.createdDate, {
        validators: [Validators.required],
      }),
      editedDate: new FormControl(postRawValue.editedDate),
      totalLikes: new FormControl(postRawValue.totalLikes),
      author: new FormControl(postRawValue.author),
    });
  }

  getPost(form: PostFormGroup): IPost | NewPost {
    return form.getRawValue() as IPost | NewPost;
  }

  resetForm(form: PostFormGroup, post: PostFormGroupInput): void {
    const postRawValue = { ...this.getFormDefaults(), ...post };
    form.reset(
      {
        ...postRawValue,
        id: { value: postRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }
  private getFormDefaults(): PostFormDefaults {
    return {
      id: null,
    };
  }
}
