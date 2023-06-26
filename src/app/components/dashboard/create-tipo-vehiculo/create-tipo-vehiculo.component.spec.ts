import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTipoVehiculoComponent } from './create-tipo-vehiculo.component';

describe('CreateTipoVehiculoComponent', () => {
  let component: CreateTipoVehiculoComponent;
  let fixture: ComponentFixture<CreateTipoVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTipoVehiculoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTipoVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
