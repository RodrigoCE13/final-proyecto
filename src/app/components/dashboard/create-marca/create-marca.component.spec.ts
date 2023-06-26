import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMarcaComponent } from './create-marca.component';

describe('CreateMarcaComponent', () => {
  let component: CreateMarcaComponent;
  let fixture: ComponentFixture<CreateMarcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMarcaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
