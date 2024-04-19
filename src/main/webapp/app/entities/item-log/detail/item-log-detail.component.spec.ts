import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ItemLogDetailComponent } from './item-log-detail.component';

describe('ItemLog Management Detail Component', () => {
  let comp: ItemLogDetailComponent;
  let fixture: ComponentFixture<ItemLogDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemLogDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ itemLog: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ItemLogDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ItemLogDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load itemLog on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.itemLog).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
