import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChatroomDetailComponent } from './chatroom-detail.component';

describe('Chatroom Management Detail Component', () => {
  let comp: ChatroomDetailComponent;
  let fixture: ComponentFixture<ChatroomDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatroomDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chatroom: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChatroomDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChatroomDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chatroom on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chatroom).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
