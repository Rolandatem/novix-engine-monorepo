import { TestBed } from '@angular/core/testing';

import { NovixEngThemeService } from './novix-eng-theme-service';
import { mockComputedStyle } from '../../testing/mocks/mock-computed-style';
import Cookies from 'js-cookie';
import { mockMatchMedia } from '../../testing/mocks/mock-match-media';
import { PLATFORM_ID } from '@angular/core';
import { mockDocumentStyleSheets } from '../../testing/mocks/mock-document-stylesheets';


describe('NovixEngThemeService - Structure', () => {
  let service: NovixEngThemeService;

  beforeEach(() => {
    //--Clear any cookies made between tests.
    Cookies.remove('novix.theme.light');
    Cookies.remove('novix.theme.dark');
    Cookies.remove('novix.theme.mode');

    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    delete (window as any).matchMedia;
    delete (document as any).styleSheets;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  })

  //===========================================================================================================================
  it('should be created with light mode', () => {
    mockMatchMedia();
    const mediaSpy = vi.spyOn(window, 'matchMedia');
    service = TestBed.inject(NovixEngThemeService);
    expect(service).toBeTruthy();

    expect(mediaSpy).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });

  //===========================================================================================================================
  it('should register and retrieve themes', () => {
    service = TestBed.inject(NovixEngThemeService);
    service.registerTheme('theme-a');
    service.registerTheme('theme-b');

    const themes = service.getRegisteredThemes();
    expect(themes.map(t => t.id)).toContain('theme-a');
    expect(themes.map(t => t.id)).toContain('theme-b');
  });

  //===========================================================================================================================
  it('should set correct light and dark themes when specified', () => {
    mockComputedStyle();
    service = TestBed.inject(NovixEngThemeService);
    service.registerTheme('light-theme');
    service.registerTheme('dark-theme');

    service.setLightTheme('light-theme');
    service.setDarkTheme('dark-theme');

    const ids = service.getActiveThemeIds();
    expect(ids.light).toBe('light-theme');
    expect(ids.dark).toBe('dark-theme');
  });

  //===========================================================================================================================
  it('should toggle mode when dual-mode is enabled', () => {
    mockComputedStyle();
    service = TestBed.inject(NovixEngThemeService);
    service.initialize({ watchSystemMode: true });

    const initialMode = service.getCurrentMode();
    service.toggleMode();
    const toggledMode = service.getCurrentMode();

    expect(toggledMode).not.toBe(initialMode);
  });

  //===========================================================================================================================
  it('should set theme for current mode', () => {
    mockComputedStyle();
    mockMatchMedia();
    service = TestBed.inject(NovixEngThemeService);
    service.initialize({ watchSystemMode: true });

    service.registerTheme('light-theme');
    service.registerTheme('dark-theme');
    service.registerTheme('rose-theme');
    service.registerTheme('blue-theme');

    service.setLightTheme('light-theme');
    service.setDarkTheme('dark-theme');

    //--Should be in light mode.
    expect(service.getCurrentMode()).toBe('light');
    expect(service.getCurrentThemeId()).toBe('light-theme');
    //--toggle to dark mode.
    service.toggleMode();
    expect(service.getCurrentMode()).toBe('dark');
    expect(service.getCurrentThemeId()).toBe('dark-theme');

    //--Set new themes
    service.setLightTheme('rose-theme');
    service.setDarkTheme('blue-theme');

    //--Force light mode.
    service.setMode('light');
    expect(service.getCurrentMode()).toBe('light');
    expect(service.getCurrentThemeId()).toBe('rose-theme');

    //--Force dark mode.
    service.setMode('dark');
    expect(service.getCurrentMode()).toBe('dark');
    expect(service.getCurrentThemeId()).toBe('blue-theme');
  });

  //===========================================================================================================================
  it('should initialize with default themes if none provided', () => {
    mockComputedStyle();
    mockMatchMedia()
    service = TestBed.inject(NovixEngThemeService);
    service.initialize();

    const themes = service.getRegisteredThemes().map(t => t.id);
    expect(themes).toContain('novix-default-light');
    expect(themes).toContain('novix-default-dark');
  });

  //===========================================================================================================================
  it('should throw error if CSS theme was not included in application', () => {
    mockComputedStyle(true);
    mockMatchMedia();

    service = TestBed.inject(NovixEngThemeService);

    expect(() => service.setLightTheme('light-theme'))
      .toThrow('is active but no CSS variables were found');
  });

  //===========================================================================================================================
  it('should exit the private applyCurrentMode() method early when not in browser', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    service = TestBed.inject(NovixEngThemeService);

    //--Check that the first non-conditional action after was not run.
    const rendererSpy = vi.spyOn(service['_renderer'], 'addClass');

    service.setLightTheme('light-theme');

    expect(rendererSpy).not.toHaveBeenCalled();
  });

  //===========================================================================================================================
  it('should exit the private applyCurrentMode() method early when no theme id is set.', () => {
    service = TestBed.inject(NovixEngThemeService);

    //--Check tha the first non-conditional action after was not run.
    const rendererSpy = vi.spyOn(service['_renderer'], 'addClass');

    //--All code paths set a mode somehow, so run private method manually.
    service['applyCurrentMode']();

    expect(rendererSpy).not.toHaveBeenCalled();
  });

  //===========================================================================================================================
  it('should warn that the specified theme was not registered', () => {
    const warnSpy = vi.spyOn(console, 'warn')
      .mockImplementation(() => {}); //--So it doesn't write to the terminal mid unit test.
    mockComputedStyle();
    service = TestBed.inject(NovixEngThemeService);

    service.setLightTheme('some-unknown-theme');

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('is not registered. Did you forget to register it?')
    );
  });

  //===========================================================================================================================
  it('should identify that the user does not prefer dark mode by system preferences', () => {
    mockMatchMedia();
    service = TestBed.inject(NovixEngThemeService);

    expect(service['getSystemPrefersDark']()).toBe(false);
  });

  //===========================================================================================================================
  it('should identify that the user prefers dark mode by system preferences', () => {
    mockMatchMedia(true);
    service = TestBed.inject(NovixEngThemeService);

    expect(service['getSystemPrefersDark']()).toBe(true);
  });

  //===========================================================================================================================
  it('should return false when _prefersDarkQuery is undefined (SSR scenario)', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    mockMatchMedia();
    service = TestBed.inject(NovixEngThemeService);

    expect(service['getSystemPrefersDark']()).toBe(false);
  });

  //===========================================================================================================================
  it('should should persist light theme to cookies when set', () => {
    mockComputedStyle();
    service = TestBed.inject(NovixEngThemeService);
    service.registerTheme('light-theme');
    service.setLightTheme('light-theme');

    expect(Cookies.get('novix.theme.light')).toBe('light-theme');
  });

  //===========================================================================================================================
  it('should persist dark theme to cookies when set', () => {
    mockComputedStyle();
    service = TestBed.inject(NovixEngThemeService);
    service.registerTheme('dark-theme');
    service.setDarkTheme('dark-theme');

    expect(Cookies.get('novix.theme.dark')).toBe('dark-theme');
  });

  //===========================================================================================================================
  it('should ignore cookie persist request when not running in browser (SSR scenario)', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    service = TestBed.inject(NovixEngThemeService);
    service['restore']();

    expect(service['_lightThemeId']()).toBeNull();
    expect(service['_darkThemeId']()).toBeNull();
  });

  //===========================================================================================================================
  it('should restore light and dark themes from cookies if they exist', () => {
    service = TestBed.inject(NovixEngThemeService);
    service.registerTheme('light-theme');
    service.registerTheme('dark-theme');

    Cookies.set('novix.theme.light', 'light-theme');
    Cookies.set('novix.theme.dark', 'dark-theme');

    service['restore']();

    expect(service['_lightThemeId']()).toBe('light-theme');
    expect(service['_darkThemeId']()).toBe('dark-theme');
  });

  //===========================================================================================================================
  it('should restore light/dark mode from cookies if they exist', () => {
    service = TestBed.inject(NovixEngThemeService);

    Cookies.set('novix.theme.mode', 'dark');

    service['restore']();

    expect(service.getCurrentMode()).toBe('dark');
  });

  //===========================================================================================================================
  it('should return false for cssClassExists if not in browser mode (SSR scenario)', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    service = TestBed.inject(NovixEngThemeService);
    expect(service['cssClassExists']('light-theme')).toBe(false);
  });

  //===========================================================================================================================
  it('should return false for cssClassExists if a non-existant class is requested', () => {
    mockDocumentStyleSheets(['light-theme']);
    service = TestBed.inject(NovixEngThemeService);
    expect(service['cssClassExists']('unknown-class')).toBe(false);
  });

  //===========================================================================================================================
  it('should return true for cssClassExists when an existing class is requested', () => {
    mockDocumentStyleSheets(
      ['light-theme'],
      //--true below just for code coverage.
      true);
    service = TestBed.inject(NovixEngThemeService);
    service.registerTheme('light-theme');

    expect(service['cssClassExists']('light-theme')).toBe(true);
  });

  //===========================================================================================================================
  it('should set the correct theme property when setCurrentModeTheme is used', () => {
    mockComputedStyle();
    service = TestBed.inject(NovixEngThemeService);
    service.initialize({
      watchSystemMode: true,
      initialLightTheme: 'light-theme',
      initialDarkTheme: 'dark-theme',
      registerThemes: [
        { id: 'light-theme' },
        { id: 'dark-theme' },
        { id: 'rose-theme' },
        { id: 'blue-theme' }
      ]
    });

    //--Set new light mode theme.
    service.setMode('light');
    service.setCurrentModeTheme('rose-theme');
    expect(service.getCurrentThemeId()).toBe('rose-theme');

    //--Set new dark mode theme.
    service.setMode('dark');
    service.setCurrentModeTheme('blue-theme');
    expect(service.getCurrentThemeId()).toBe('blue-theme');
  });

  //===========================================================================================================================
  it('should default to light mode when currentModeSig is undefined', () => {
    service = TestBed.inject(NovixEngThemeService);

    //--Request current mode before doing anything, i.e. intialize, setMode, etc.
    const mode = service.getCurrentMode();

    expect(mode).toBe('light');
  });

  //===========================================================================================================================
  it('should warn that toggleMode is ignored when dual mode is not set', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    service = TestBed.inject(NovixEngThemeService);

    service.toggleMode();

    expect(warnSpy).toHaveBeenCalledWith('[NovixEngine] toggleMode() ignored — dual-mode is not enabled.');
  });

  //===========================================================================================================================
  it('should switch between dark and light modes when toggleMode is fired', () => {
    mockComputedStyle();
    service = TestBed.inject(NovixEngThemeService);
    service.initialize({
      watchSystemMode: true
    });

    //--Start out in light mode.
    service.setMode('light');

    //--First toggle => dark.
    service.toggleMode();
    expect(service.getCurrentMode()).toBe('dark');

    //--Second taggle => light. (for code coverage)
    service.toggleMode();
    expect(service.getCurrentMode()).toBe('light');
  });

  //===========================================================================================================================
  it('should warn that setMode is ignored when dual mode is not set', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    service = TestBed.inject(NovixEngThemeService);

    service.setMode('dark');

    expect(warnSpy).toHaveBeenCalledWith('[NovixEngine] - setMode() ignored - dual-mode is not enabled.');
  });

  //===========================================================================================================================
  it('should initialize in dark mode if system prefers dark and initialDarkTheme is set', () => {
    mockComputedStyle();
    mockMatchMedia(true); // prefers dark

    service = TestBed.inject(NovixEngThemeService);
    service.registerTheme('light-theme');
    service.registerTheme('dark-theme');

    service.initialize({
      watchSystemMode: true,
      initialLightTheme: 'light-theme',
      initialDarkTheme: 'dark-theme'
    });

    expect(service.getCurrentMode()).toBe('dark');
    expect(service.getCurrentThemeId()).toBe('dark-theme');
  });

  //===========================================================================================================================
  it('should run the system watch listener code when the event is fired', () => {
    mockMatchMedia();
    mockComputedStyle();

    const mockMediaQueryList = {
      listeners: new Map(),
      matches: false,
      addEventListener: vi.fn((event, listener) => {
        if (!mockMediaQueryList.listeners.has(event)) {
          mockMediaQueryList.listeners.set(event, []);
        }
        mockMediaQueryList.listeners.get(event)?.push(listener);
      }),
      dispatchEvent: (event: any) => {
        const listeners = mockMediaQueryList.listeners.get('change');
        if (listeners) {
          listeners.forEach((listener: (arg0: any) => any) => listener(event));
        }
      }
    }

    //--Setup match media to return our mocked query list.
    vi.spyOn(window, 'matchMedia')
      .mockReturnValue(mockMediaQueryList as any);

    service = TestBed.inject(NovixEngThemeService);
    service.initialize({watchSystemMode: true});

    const applyCurrentModeSpy = vi.spyOn(service as any, 'applyCurrentMode');
    const persistSpy = vi.spyOn(service as any, 'persist');

    let changeEvent = { matches: true };
    mockMediaQueryList.dispatchEvent(changeEvent);

    expect(applyCurrentModeSpy).toHaveBeenCalled();
    expect(persistSpy).toHaveBeenCalled();

    //--Run opposite change event for code coverage.
    changeEvent.matches = false;
    mockMediaQueryList.dispatchEvent(changeEvent);
  });

  //===========================================================================================================================
  it('should fallback to initial theme if restored theme IDs are missing in CSS', () => {
    mockComputedStyle();
    //--Does not include rose-theme or blue-theme.
    mockDocumentStyleSheets(['unrelated-theme']);

    Cookies.set('novix.theme.light', 'rose-theme');
    Cookies.set('novix.theme.dark', 'blue-theme');
    Cookies.set('novix.theme.mode', 'light');

    service = TestBed.inject(NovixEngThemeService);
    service.registerTheme('rose-theme');
    service.registerTheme('blue-theme');
    service.initialize({
      initialLightTheme: 'novix-default-light',
      initialDarkTheme: 'novix-default-dark'
    });

    const ids = service.getActiveThemeIds();
    expect(ids.light).toBe('novix-default-light');
    expect(ids.dark).toBe('novix-default-dark');
  });

  //===========================================================================================================================
  it('should return empty theme ids for light and dark when calling getActiveThemeIds and not setting any', () => {
    service = TestBed.inject(NovixEngThemeService);

    expect(service.getActiveThemeIds().light).toBe('');
    expect(service.getActiveThemeIds().dark).toBe('');
  });
});
