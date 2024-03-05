import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitySideNavComponent } from './community-side-nav.component';

describe('CommunitySideNavComponent', () => {
  let component: CommunitySideNavComponent;
  let fixture: ComponentFixture<CommunitySideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunitySideNavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunitySideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
