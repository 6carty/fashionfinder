import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ClothingItemDetailComponent } from './clothing-item-detail.component';

describe('ClothingItem Management Detail Component', () => {
  let comp: ClothingItemDetailComponent;
  let fixture: ComponentFixture<ClothingItemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClothingItemDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ clothingItem: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ClothingItemDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ClothingItemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load clothingItem on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.clothingItem).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
