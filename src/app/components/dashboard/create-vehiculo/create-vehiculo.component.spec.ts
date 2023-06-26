import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVehiculoComponent } from './create-vehiculo.component';

describe('CreateVehiculoComponent', () => {
  let component: CreateVehiculoComponent;
  let fixture: ComponentFixture<CreateVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVehiculoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
