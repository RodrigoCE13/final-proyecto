import { TestBed } from '@angular/core/testing';

import { MantencionService } from './mantencion.service';

describe('MantencionService', () => {
  let service: MantencionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MantencionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
