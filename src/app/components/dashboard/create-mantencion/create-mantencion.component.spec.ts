import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMantencionComponent } from './create-mantencion.component';

describe('CreateMantencionComponent', () => {
  let component: CreateMantencionComponent;
  let fixture: ComponentFixture<CreateMantencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMantencionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMantencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
