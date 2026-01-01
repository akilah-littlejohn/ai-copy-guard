import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayBrain } from './gateway-brain';

describe('GatewayBrain', () => {
  let component: GatewayBrain;
  let fixture: ComponentFixture<GatewayBrain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayBrain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatewayBrain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
