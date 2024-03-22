import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ChatMessageService } from '../service/chat-message.service';

import { ChatMessageComponent } from './chat-message.component';

describe('ChatMessage Management Component', () => {
  let comp: ChatMessageComponent;
  let fixture: ComponentFixture<ChatMessageComponent>;
  let service: ChatMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'chat-message', component: ChatMessageComponent }]), HttpClientTestingModule],
      declarations: [ChatMessageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ChatMessageComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChatMessageComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChatMessageService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.chatMessages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to chatMessageService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getChatMessageIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getChatMessageIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
