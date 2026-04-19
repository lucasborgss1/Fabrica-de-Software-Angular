import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsPage } from './requests-page';

describe('RequestsPage', () => {
  let component: RequestsPage;
  let fixture: ComponentFixture<RequestsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
