import { TestBed } from '@angular/core/testing';

import { NovixEngThemeService } from './novix-eng-theme-service';
import { createMockMatchMedia } from '../../testing/mocks/mock-match-media';

describe('NovixEngThemeService', () => {
  let service: NovixEngThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    delete (window as any).matchMedia;
    vi.restoreAllMocks();
  })

  it('should be created with light mode', () => {
    const mockMatchMedia = createMockMatchMedia(false);
    service = TestBed.inject(NovixEngThemeService);
    expect(service).toBeTruthy();
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });
});
