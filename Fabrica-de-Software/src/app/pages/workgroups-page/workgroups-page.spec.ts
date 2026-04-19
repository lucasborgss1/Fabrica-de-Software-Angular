import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkgroupsPage } from './workgroups-page';

describe('WorkgroupsPage', () => {
  let component: WorkgroupsPage;
  let fixture: ComponentFixture<WorkgroupsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkgroupsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkgroupsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
