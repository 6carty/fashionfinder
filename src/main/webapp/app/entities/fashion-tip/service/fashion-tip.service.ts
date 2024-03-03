import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFashionTip, NewFashionTip } from '../fashion-tip.model';

export type PartialUpdateFashionTip = Partial<IFashionTip> & Pick<IFashionTip, 'id'>;

export type EntityResponseType = HttpResponse<IFashionTip>;
export type EntityArrayResponseType = HttpResponse<IFashionTip[]>;

@Injectable({ providedIn: 'root' })
export class FashionTipService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fashion-tips');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(fashionTip: NewFashionTip): Observable<EntityResponseType> {
    return this.http.post<IFashionTip>(this.resourceUrl, fashionTip, { observe: 'response' });
  }

  update(fashionTip: IFashionTip): Observable<EntityResponseType> {
    return this.http.put<IFashionTip>(`${this.resourceUrl}/${this.getFashionTipIdentifier(fashionTip)}`, fashionTip, {
      observe: 'response',
    });
  }

  partialUpdate(fashionTip: PartialUpdateFashionTip): Observable<EntityResponseType> {
    return this.http.patch<IFashionTip>(`${this.resourceUrl}/${this.getFashionTipIdentifier(fashionTip)}`, fashionTip, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFashionTip>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFashionTip[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFashionTipIdentifier(fashionTip: Pick<IFashionTip, 'id'>): number {
    return fashionTip.id;
  }

  compareFashionTip(o1: Pick<IFashionTip, 'id'> | null, o2: Pick<IFashionTip, 'id'> | null): boolean {
    return o1 && o2 ? this.getFashionTipIdentifier(o1) === this.getFashionTipIdentifier(o2) : o1 === o2;
  }

  addFashionTipToCollectionIfMissing<Type extends Pick<IFashionTip, 'id'>>(
    fashionTipCollection: Type[],
    ...fashionTipsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const fashionTips: Type[] = fashionTipsToCheck.filter(isPresent);
    if (fashionTips.length > 0) {
      const fashionTipCollectionIdentifiers = fashionTipCollection.map(fashionTipItem => this.getFashionTipIdentifier(fashionTipItem)!);
      const fashionTipsToAdd = fashionTips.filter(fashionTipItem => {
        const fashionTipIdentifier = this.getFashionTipIdentifier(fashionTipItem);
        if (fashionTipCollectionIdentifiers.includes(fashionTipIdentifier)) {
          return false;
        }
        fashionTipCollectionIdentifiers.push(fashionTipIdentifier);
        return true;
      });
      return [...fashionTipsToAdd, ...fashionTipCollection];
    }
    return fashionTipCollection;
  }
}
