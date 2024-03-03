import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ChatroomService } from '../service/chatroom.service';

import { ChatroomComponent } from './chatroom.component';

describe('Chatroom Management Component', () => {
  let comp: ChatroomComponent;
  let fixture: ComponentFixture<ChatroomComponent>;
  let service: ChatroomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'chatroom', component: ChatroomComponent }]), HttpClientTestingModule],
      declarations: [ChatroomComponent],
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
      .overrideTemplate(ChatroomComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChatroomComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChatroomService);

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
    expect(comp.chatrooms?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to chatroomService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getChatroomIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getChatroomIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
