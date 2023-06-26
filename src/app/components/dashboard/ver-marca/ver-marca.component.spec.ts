import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMarcaComponent } from './ver-marca.component';

describe('VerMarcaComponent', () => {
  let component: VerMarcaComponent;
  let fixture: ComponentFixture<VerMarcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerMarcaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerMarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
