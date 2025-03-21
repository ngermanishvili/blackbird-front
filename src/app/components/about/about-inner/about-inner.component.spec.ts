import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutInnerComponent } from './about-inner.component';

describe('AboutInnerComponent', () => {
  let component: AboutInnerComponent;
  let fixture: ComponentFixture<AboutInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutInnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AboutInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
