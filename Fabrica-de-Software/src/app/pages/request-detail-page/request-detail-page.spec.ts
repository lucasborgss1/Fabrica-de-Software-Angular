import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDetailPage } from './request-detail-page';

describe('RequestDetailPage', () => {
  let component: RequestDetailPage;
  let fixture: ComponentFixture<RequestDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
