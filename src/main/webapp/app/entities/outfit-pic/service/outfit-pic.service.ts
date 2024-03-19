import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOutfitPic, NewOutfitPic } from '../outfit-pic.model';

export type PartialUpdateOutfitPic = Partial<IOutfitPic> & Pick<IOutfitPic, 'id'>;

export type EntityResponseType = HttpResponse<IOutfitPic>;
export type EntityArrayResponseType = HttpResponse<IOutfitPic[]>;

@Injectable({ providedIn: 'root' })
export class OutfitPicService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/outfit-pics');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(outfitPic: NewOutfitPic): Observable<EntityResponseType> {
    return this.http.post<IOutfitPic>(this.resourceUrl, outfitPic, { observe: 'response' });
  }

  update(outfitPic: IOutfitPic): Observable<EntityResponseType> {
    return this.http.put<IOutfitPic>(`${this.resourceUrl}/${this.getOutfitPicIdentifier(outfitPic)}`, outfitPic, { observe: 'response' });
  }

  partialUpdate(outfitPic: PartialUpdateOutfitPic): Observable<EntityResponseType> {
    return this.http.patch<IOutfitPic>(`${this.resourceUrl}/${this.getOutfitPicIdentifier(outfitPic)}`, outfitPic, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOutfitPic>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOutfitPic[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOutfitPicIdentifier(outfitPic: Pick<IOutfitPic, 'id'>): number {
    return outfitPic.id;
  }

  compareOutfitPic(o1: Pick<IOutfitPic, 'id'> | null, o2: Pick<IOutfitPic, 'id'> | null): boolean {
    return o1 && o2 ? this.getOutfitPicIdentifier(o1) === this.getOutfitPicIdentifier(o2) : o1 === o2;
  }

  addOutfitPicToCollectionIfMissing<Type extends Pick<IOutfitPic, 'id'>>(
    outfitPicCollection: Type[],
    ...outfitPicsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const outfitPics: Type[] = outfitPicsToCheck.filter(isPresent);
    if (outfitPics.length > 0) {
      const outfitPicCollectionIdentifiers = outfitPicCollection.map(outfitPicItem => this.getOutfitPicIdentifier(outfitPicItem)!);
      const outfitPicsToAdd = outfitPics.filter(outfitPicItem => {
        const outfitPicIdentifier = this.getOutfitPicIdentifier(outfitPicItem);
        if (outfitPicCollectionIdentifiers.includes(outfitPicIdentifier)) {
          return false;
        }
        outfitPicCollectionIdentifiers.push(outfitPicIdentifier);
        return true;
      });
      return [...outfitPicsToAdd, ...outfitPicCollection];
    }
    return outfitPicCollection;
  }
}
