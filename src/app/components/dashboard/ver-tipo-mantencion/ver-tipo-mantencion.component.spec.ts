import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTipoMantencionComponent } from './ver-tipo-mantencion.component';

describe('VerTipoMantencionComponent', () => {
  let component: VerTipoMantencionComponent;
  let fixture: ComponentFixture<VerTipoMantencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerTipoMantencionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerTipoMantencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
