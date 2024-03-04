import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixandmatchComponent } from './mixandmatch.component';

describe('MixandmatchComponent', () => {
  let component: MixandmatchComponent;
  let fixture: ComponentFixture<MixandmatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MixandmatchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MixandmatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
