import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorsPage } from './professors-page';

describe('ProfessorsPage', () => {
  let component: ProfessorsPage;
  let fixture: ComponentFixture<ProfessorsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessorsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
