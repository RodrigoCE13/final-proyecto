import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMecanicoComponent } from './create-mecanico.component';

describe('CreateMecanicoComponent', () => {
  let component: CreateMecanicoComponent;
  let fixture: ComponentFixture<CreateMecanicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMecanicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMecanicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
