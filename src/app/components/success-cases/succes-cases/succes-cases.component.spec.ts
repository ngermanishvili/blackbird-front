import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccesCasesComponent } from './succes-cases.component';

describe('SuccesCasesComponent', () => {
  let component: SuccesCasesComponent;
  let fixture: ComponentFixture<SuccesCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccesCasesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuccesCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
