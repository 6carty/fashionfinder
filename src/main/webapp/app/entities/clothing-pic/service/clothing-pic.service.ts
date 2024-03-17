import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClothingPic, NewClothingPic } from '../clothing-pic.model';

export type PartialUpdateClothingPic = Partial<IClothingPic> & Pick<IClothingPic, 'id'>;

export type EntityResponseType = HttpResponse<IClothingPic>;
export type EntityArrayResponseType = HttpResponse<IClothingPic[]>;

@Injectable({ providedIn: 'root' })
export class ClothingPicService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/clothing-pics');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(clothingPic: NewClothingPic): Observable<EntityResponseType> {
    return this.http.post<IClothingPic>(this.resourceUrl, clothingPic, { observe: 'response' });
  }

  update(clothingPic: IClothingPic): Observable<EntityResponseType> {
    return this.http.put<IClothingPic>(`${this.resourceUrl}/${this.getClothingPicIdentifier(clothingPic)}`, clothingPic, {
      observe: 'response',
    });
  }

  partialUpdate(clothingPic: PartialUpdateClothingPic): Observable<EntityResponseType> {
    return this.http.patch<IClothingPic>(`${this.resourceUrl}/${this.getClothingPicIdentifier(clothingPic)}`, clothingPic, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClothingPic>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClothingPic[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getClothingPicIdentifier(clothingPic: Pick<IClothingPic, 'id'>): number {
    return clothingPic.id;
  }

  compareClothingPic(o1: Pick<IClothingPic, 'id'> | null, o2: Pick<IClothingPic, 'id'> | null): boolean {
    return o1 && o2 ? this.getClothingPicIdentifier(o1) === this.getClothingPicIdentifier(o2) : o1 === o2;
  }

  addClothingPicToCollectionIfMissing<Type extends Pick<IClothingPic, 'id'>>(
    clothingPicCollection: Type[],
    ...clothingPicsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const clothingPics: Type[] = clothingPicsToCheck.filter(isPresent);
    if (clothingPics.length > 0) {
      const clothingPicCollectionIdentifiers = clothingPicCollection.map(
        clothingPicItem => this.getClothingPicIdentifier(clothingPicItem)!
      );
      const clothingPicsToAdd = clothingPics.filter(clothingPicItem => {
        const clothingPicIdentifier = this.getClothingPicIdentifier(clothingPicItem);
        if (clothingPicCollectionIdentifiers.includes(clothingPicIdentifier)) {
          return false;
        }
        clothingPicCollectionIdentifiers.push(clothingPicIdentifier);
        return true;
      });
      return [...clothingPicsToAdd, ...clothingPicCollection];
    }
    return clothingPicCollection;
  }
}
