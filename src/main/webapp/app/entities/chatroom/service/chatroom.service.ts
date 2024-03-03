import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChatroom, NewChatroom } from '../chatroom.model';

export type PartialUpdateChatroom = Partial<IChatroom> & Pick<IChatroom, 'id'>;

export type EntityResponseType = HttpResponse<IChatroom>;
export type EntityArrayResponseType = HttpResponse<IChatroom[]>;

@Injectable({ providedIn: 'root' })
export class ChatroomService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chatrooms');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chatroom: NewChatroom): Observable<EntityResponseType> {
    return this.http.post<IChatroom>(this.resourceUrl, chatroom, { observe: 'response' });
  }

  update(chatroom: IChatroom): Observable<EntityResponseType> {
    return this.http.put<IChatroom>(`${this.resourceUrl}/${this.getChatroomIdentifier(chatroom)}`, chatroom, { observe: 'response' });
  }

  partialUpdate(chatroom: PartialUpdateChatroom): Observable<EntityResponseType> {
    return this.http.patch<IChatroom>(`${this.resourceUrl}/${this.getChatroomIdentifier(chatroom)}`, chatroom, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChatroom>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChatroom[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getChatroomIdentifier(chatroom: Pick<IChatroom, 'id'>): number {
    return chatroom.id;
  }

  compareChatroom(o1: Pick<IChatroom, 'id'> | null, o2: Pick<IChatroom, 'id'> | null): boolean {
    return o1 && o2 ? this.getChatroomIdentifier(o1) === this.getChatroomIdentifier(o2) : o1 === o2;
  }

  addChatroomToCollectionIfMissing<Type extends Pick<IChatroom, 'id'>>(
    chatroomCollection: Type[],
    ...chatroomsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const chatrooms: Type[] = chatroomsToCheck.filter(isPresent);
    if (chatrooms.length > 0) {
      const chatroomCollectionIdentifiers = chatroomCollection.map(chatroomItem => this.getChatroomIdentifier(chatroomItem)!);
      const chatroomsToAdd = chatrooms.filter(chatroomItem => {
        const chatroomIdentifier = this.getChatroomIdentifier(chatroomItem);
        if (chatroomCollectionIdentifiers.includes(chatroomIdentifier)) {
          return false;
        }
        chatroomCollectionIdentifiers.push(chatroomIdentifier);
        return true;
      });
      return [...chatroomsToAdd, ...chatroomCollection];
    }
    return chatroomCollection;
  }
}
