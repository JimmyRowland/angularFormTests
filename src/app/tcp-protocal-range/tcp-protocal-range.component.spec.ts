import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcpProtocalRangeComponent } from './tcp-protocal-range.component';

describe('TcpProtocalRangeComponent', () => {
  let component: TcpProtocalRangeComponent;
  let fixture: ComponentFixture<TcpProtocalRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TcpProtocalRangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TcpProtocalRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
