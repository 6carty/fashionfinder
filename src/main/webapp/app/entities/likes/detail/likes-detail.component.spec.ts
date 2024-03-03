import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LikesDetailComponent } from './likes-detail.component';

describe('Likes Management Detail Component', () => {
  let comp: LikesDetailComponent;
  let fixture: ComponentFixture<LikesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LikesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ likes: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LikesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LikesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load likes on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.likes).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
