import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixAndMatchComponent } from './mix-and-match.component';

describe('MixAndMatchComponent', () => {
  let component: MixAndMatchComponent;
  let fixture: ComponentFixture<MixAndMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MixAndMatchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MixAndMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
