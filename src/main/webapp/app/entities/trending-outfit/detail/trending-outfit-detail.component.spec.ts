import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrendingOutfitDetailComponent } from './trending-outfit-detail.component';

describe('TrendingOutfit Management Detail Component', () => {
  let comp: TrendingOutfitDetailComponent;
  let fixture: ComponentFixture<TrendingOutfitDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrendingOutfitDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ trendingOutfit: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TrendingOutfitDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TrendingOutfitDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load trendingOutfit on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.trendingOutfit).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
