import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePageItemComponent } from './service-page-item.component';

describe('ServicePageItemComponent', () => {
  let component: ServicePageItemComponent;
  let fixture: ComponentFixture<ServicePageItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicePageItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicePageItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
