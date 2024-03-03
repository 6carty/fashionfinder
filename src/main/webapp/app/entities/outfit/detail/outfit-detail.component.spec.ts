import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OutfitDetailComponent } from './outfit-detail.component';

describe('Outfit Management Detail Component', () => {
  let comp: OutfitDetailComponent;
  let fixture: ComponentFixture<OutfitDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutfitDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ outfit: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OutfitDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OutfitDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load outfit on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.outfit).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
