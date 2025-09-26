import { TestBed } from '@angular/core/testing';
import { NovixEngThemeService } from './novix-eng-theme-service';
import { mockMatchMedia } from '../../testing/mocks/mock-match-media';

//===========================================================================================================================
//--Using a separate testing block for mocked js-cookie test to make sure
//--we don't affect other tests that use the real one.
describe('NovixEngThemeService - Mocked js-cookie', () => {
  let service: NovixEngThemeService;

  function mockJSCookie() {
    //-Mock js-cookie to simulate methods.
    vi.mock('js-cookie', () => ({
      default: {
        get: undefined,
        set: undefined
      }
    }));
  }

  beforeEach(() => {
    mockJSCookie();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  })

  //===========================================================================================================================
  it('should warn if peer dependency js-cookie is missing or invalid', async() => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mockMatchMedia();
    service = TestBed.inject(NovixEngThemeService);

    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Missing peer dependency "js-cookie"'));
  });
});
