import { TestBed } from '@angular/core/testing';

import { TipoMantencionService } from './tipo-mantencion.service';

describe('TipoMantencionService', () => {
  let service: TipoMantencionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoMantencionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
