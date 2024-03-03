import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FashionTipDetailComponent } from './fashion-tip-detail.component';

describe('FashionTip Management Detail Component', () => {
  let comp: FashionTipDetailComponent;
  let fixture: ComponentFixture<FashionTipDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FashionTipDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ fashionTip: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FashionTipDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FashionTipDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load fashionTip on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.fashionTip).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
