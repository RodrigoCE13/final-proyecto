import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTipoVehiculoComponent } from './ver-tipo-vehiculo.component';

describe('VerTipoVehiculoComponent', () => {
  let component: VerTipoVehiculoComponent;
  let fixture: ComponentFixture<VerTipoVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerTipoVehiculoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerTipoVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
