import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardScrollComponent } from './hard-scroll.component';

describe('HardScrollComponent', () => {
  let component: HardScrollComponent;
  let fixture: ComponentFixture<HardScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HardScrollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HardScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
