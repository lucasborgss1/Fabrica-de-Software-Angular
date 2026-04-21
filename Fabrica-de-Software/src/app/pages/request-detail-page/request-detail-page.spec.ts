import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BackendApi } from '../../core/services/backend-api';
import { RequestDetailPage } from './request-detail-page';

describe('RequestDetailPage', () => {
  let component: RequestDetailPage;
  let fixture: ComponentFixture<RequestDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestDetailPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
          },
        },
        {
          provide: Location,
          useValue: {
            back: () => undefined,
          },
        },
        {
          provide: BackendApi,
          useValue: {
            listProjects: () => of([]),
            listWorkgroups: () => of([]),
            analyzeProject: () => of({}),
            approveProject: () => of({}),
            cancelProject: () => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
