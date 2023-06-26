import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMecanicosComponent } from './ver-mecanicos.component';

describe('VerMecanicosComponent', () => {
  let component: VerMecanicosComponent;
  let fixture: ComponentFixture<VerMecanicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerMecanicosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerMecanicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
