import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerValorComponent } from './ver-valor.component';

describe('VerValorComponent', () => {
  let component: VerValorComponent;
  let fixture: ComponentFixture<VerValorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerValorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerValorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
