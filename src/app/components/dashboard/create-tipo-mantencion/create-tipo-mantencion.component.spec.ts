import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTipoMantencionComponent } from './create-tipo-mantencion.component';

describe('CreateTipoMantencionComponent', () => {
  let component: CreateTipoMantencionComponent;
  let fixture: ComponentFixture<CreateTipoMantencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTipoMantencionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTipoMantencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
