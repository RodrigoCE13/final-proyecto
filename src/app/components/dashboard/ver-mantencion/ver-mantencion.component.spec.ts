import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMantencionComponent } from './ver-mantencion.component';

describe('VerMantencionComponent', () => {
  let component: VerMantencionComponent;
  let fixture: ComponentFixture<VerMantencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerMantencionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerMantencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
