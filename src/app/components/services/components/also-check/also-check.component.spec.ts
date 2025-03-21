import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlsoCheckComponent } from './also-check.component';

describe('AlsoCheckComponent', () => {
  let component: AlsoCheckComponent;
  let fixture: ComponentFixture<AlsoCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlsoCheckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlsoCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
