import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItemLogDetailComponent } from './item-log-detail.component';

describe('ItemLog Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemLogDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ItemLogDetailComponent,
              resolve: { itemLog: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(ItemLogDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load itemLog on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ItemLogDetailComponent);

      // THEN
      expect(instance.itemLog).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
