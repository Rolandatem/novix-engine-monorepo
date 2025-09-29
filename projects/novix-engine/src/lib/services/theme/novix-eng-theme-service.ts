import { Injectable, Inject, PLATFORM_ID, Renderer2, RendererFactory2, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { INovixEngThemeInitOptions } from '../../interfaces/INovixEngThemeInitOptions';
import { INovixEngRegisteredTheme } from '../../interfaces/INovixEngRegisteredTheme';
import Cookies from 'js-cookie';

const NOVIX_STORAGE_KEYS = {
  light: 'novix.theme.light',
  dark: 'novix.theme.dark',
  mode: 'novix.theme.mode'
};

/**
 * Service for managing NovixEngine themes.
 * Handles theme registration, persistence, SSR safety, and runtime switching.
 */
@Injectable({ providedIn: 'root' })
export class NovixEngThemeService {
  //===========================================================================================================================
  // MEMBER VARIABLES
  //===========================================================================================================================
  /** Whether we are running in a browser environment */
  private readonly _isBrowser: boolean;

  /** Safe DOM renderer */
  private readonly _renderer: Renderer2;

  /** Root HTML element reference */
  private _rootEl: HTMLElement | null = null;

  /** Dual mode (light vs dark theme mode) flag. Only enabled if watchSystemMode is true. */
  private _useDualMode = false;

  /** Media query for system dark mode preference */
  private _prefersDarkQuery?: MediaQueryList;

  /** Internal registry of themes */
  private _themes = new Map<string, INovixEngRegisteredTheme>();

  /** Currently selected light theme ID */
  //private _lightThemeId?: string;
  private _lightThemeId = signal<string | null>(null);

  /** Currently selected dark theme ID */
  //private _darkThemeId?: string;
  private _darkThemeId = signal<string | null>(null);

  /** Current mode signal ('light' or 'dark') */
  private _currentModeSig = signal<'light' | 'dark' | undefined>(undefined);

  /** Current theme ID signal for the active mode */
  private _currentThemeIdSig = signal<string>('novix-default-light');

  /** Tracks the last theme class applied to <html> so it can be safely removed before applying a new one. */
  private _lastAppliedThemeId?: string | null;

  //===========================================================================================================================
  // PUBLIC PROPERTIES
  //===========================================================================================================================
  /** Public readonly signals */
  public readonly mode = this._currentModeSig.asReadonly();
  public readonly currentThemeId = this._currentThemeIdSig.asReadonly();

  //===========================================================================================================================
  // CONSTRUCTOR
  //===========================================================================================================================
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    rendererFactory: RendererFactory2
  ) {
    this._isBrowser = isPlatformBrowser(platformId);
    this._renderer = rendererFactory.createRenderer(null, null);

    if (this._isBrowser) {
      this._rootEl = this._renderer.selectRootElement('html', true);
      this._prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

      //-- Warn if cookie library is missing
      if (!Cookies || typeof Cookies.get !== 'function' || typeof Cookies.set !== 'function') {
        console.warn(
          `[NovixEngine] Missing peer dependency "js-cookie". Install it with \`npm install js-cookie\` to enable theme persistence.
          This is required for saving user selections across sessions, including SSR support.`
        );
      }
    }
  }

  //===========================================================================================================================
  // PRIVATE METHODS
  //===========================================================================================================================
  /** Applies the theme class for the current mode */
  private applyCurrentMode(): void {
    if (!this._isBrowser || !this._rootEl) { return; }

    const targetId = this._currentModeSig() === 'dark' ? this._darkThemeId() : this._lightThemeId();
    if (!targetId) { return; }

    //--Remove previously applied theme class.
    if (this._lastAppliedThemeId && this._lastAppliedThemeId !== targetId) {
      this._renderer.removeClass(this._rootEl, this._lastAppliedThemeId);
    }

    //--Apply new theme class
    this._renderer.addClass(this._rootEl, targetId);
    this._lastAppliedThemeId = targetId;

    //-- Hard Fail: CSS not loaded
    const style = getComputedStyle(this._rootEl);
    if (!style.getPropertyValue('--novix-primary').trim()) {
      throw new Error(
        `[NovixEngine] Theme "${targetId}" is active but no CSS variables were found.
        This usually means its SCSS file was not imported into your global styles.scss.
        Import the theme SCSS before using it.`
      );
    }

    //--Graceful Fail: warn if theme not registered.
    if (!this._themes.has(targetId)) {
      console.warn(`[NovixEngine] Theme "${targetId}" is not registered. Did you forget to register it?`);
    }

    // Update signal
    this._currentThemeIdSig.set(targetId);
  }

  /** Returns true if the system prefers dark mode */
  private getSystemPrefersDark(): boolean {
    return !!this._prefersDarkQuery?.matches;
  }

  /** Persists current theme selections to localStorage */
  private persist(): void {
    if (!this._isBrowser) return;

    const options = { path: '/', expires: 365 }; //--1 year
    Cookies.set(NOVIX_STORAGE_KEYS.light, this._lightThemeId() ?? '', options);
    Cookies.set(NOVIX_STORAGE_KEYS.dark, this._darkThemeId() ?? '', options);

    const mode = this._currentModeSig();
    Cookies.set(NOVIX_STORAGE_KEYS.mode, mode ?? '', {
      path: '/',
      expires: mode ? 365 : 0
    });
  }

  /** Restores theme selections from localStorage */
  private restore(): void {
    if (!this._isBrowser) return;

    const light = Cookies.get(NOVIX_STORAGE_KEYS.light);
    const dark = Cookies.get(NOVIX_STORAGE_KEYS.dark);
    const mode = Cookies.get(NOVIX_STORAGE_KEYS.mode) as 'light' | 'dark' | undefined;

    if (light && this._themes.has(light)) { this._lightThemeId.set(light); }
    if (dark && this._themes.has(dark)) { this._darkThemeId.set(dark); }
    if (mode === 'light' || mode === 'dark') { this._currentModeSig.set(mode); }
  }

  /** Returns true if the given CSS class exists in any loaded stylesheet. */
  private cssClassExists(className: string): boolean {
    if (!this._isBrowser || !className) { return false; }

    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const rules = sheet.cssRules;
        for (const rule of Array.from(rules)) {
          if (rule instanceof CSSStyleRule && rule.selectorText.includes(`.${className}`)) {
            return true;
          }
        }
      } catch {
        //--Skip inaccessible stylesheets.
        continue;
      }
    }

    return false;
  }

  //===========================================================================================================================
  // PUBLIC METHODS
  //===========================================================================================================================

  /**
   * Registers a theme with the engine. WARNING: This method is only intended to be used by the provider, any use
   * outside of that context is unsupported and may lead to unexpected behavior.
   * @param id Unique identifier for the theme.
   */
  public registerTheme(id: string): void {
    this._themes.set(id, { id });
  }

  /**
   * Returns all registered themes.
   */
  public getRegisteredThemes(): INovixEngRegisteredTheme[] {
    return Array.from(this._themes.values());
  }

  /**
   * Sets the theme to use in light mode.
   */
  public setLightTheme(id: string): void {
    this._lightThemeId.set(id);
    this.applyCurrentMode();
    this.persist();
  }

  /**
   * Sets the theme to use in dark mode.
   */
  public setDarkTheme(id: string): void {
    this._darkThemeId.set(id);
    this.applyCurrentMode();
    this.persist();
  }

  /**
   * Sets the theme for the current mode ('light' or 'dark').
   * Useful for runtime overrides in dual-mode setups.
   */
  public setCurrentModeTheme(id: string): void {
    if (this._currentModeSig() === 'dark') {
      this.setDarkTheme(id);
    } else {
      this.setLightTheme(id);
    }
  }

  /**
   * Returns the current mode ('light' or 'dark').
   */
  public getCurrentMode(): 'light' | 'dark' {
    return this._currentModeSig() ?? 'light';
  }

  /**
   * Returns the current theme ID for the active mode.
   */
  public getCurrentThemeId(): string {
    return this._currentThemeIdSig();
  }

  /**
   * Returns both light and dark theme IDs.
   */
  public getActiveThemeIds(): { light: string; dark: string } {
    return { light: this._lightThemeId() ?? '', dark: this._darkThemeId() ?? '' };
  }

  /**
   * Toggles between light and dark mode.
   */
  public toggleMode(): void {
    if (!this._useDualMode) {
      console.warn('[NovixEngine] toggleMode() ignored — dual-mode is not enabled.');
      return;
    }

    this._currentModeSig.update(m => m === 'dark' ? 'light' : 'dark');
    this.applyCurrentMode();
    this.persist();
  }

  /**
   * Forcefully sets the current light/dark mode.
   */
  public setMode(mode: 'light' | 'dark'): void {
    if (!this._useDualMode) {
      console.warn('[NovixEngine] - setMode() ignored - dual-mode is not enabled.');
      return;
    }

    this._currentModeSig.set(mode);
    this.applyCurrentMode();
    this.persist();
  }

  /**
   * Initializes the theme engine.
   * - Registers provided themes.
   * - Restores persisted themes if available.
   * - Applies defaults if none set.
   * - Applies the correct theme immediately (flicker-safe).
   * - Optionally watches for system theme changes.
   *
   * WARNING: This method is only intended to be used by the provider, any use outside of that context is unsupported
   * and may lead to unexpected behavior.
   *
   * @param options Optional initialization configuration.
   */
  public initialize(options?: INovixEngThemeInitOptions): void {
    this._useDualMode = !!options?.watchSystemMode;

    //--Register provided themes, or defaults if none provided
    if (options?.registerThemes?.length) {
      options.registerThemes.forEach(t => this.registerTheme(t.id));
    } else {
      //--Zero-config: assume defaults are set in global styles.scss.
      this.registerTheme('novix-default-light');
      this.registerTheme('novix-default-dark');
    }

    //--Step 1: Restore persisted selections
    this.restore();

    //--Step 2: Capture config-provided or default theme id's.
    const initialLight = options?.initialLightTheme ?? 'novix-default-light';
    const initialDark = options?.initialDarkTheme ?? 'novix-default-dark';

    //--Step 3: Validate restored theme id's against CSS presence.
    if (!this._lightThemeId || !this.cssClassExists(this._lightThemeId() ?? '')) {
      this._lightThemeId.set(initialLight);
    }
    if (!this._darkThemeId || !this.cssClassExists(this._darkThemeId() ?? '')) {
      this._darkThemeId.set(initialDark);
    }

    //--Step 4: Decide mode if not restored.
    if (!this._currentModeSig()) {
      //--Separated code into individual pieces for testable code in code coverage.
      const hasLight = !!options?.initialLightTheme;
      const hasDark = !!options?.initialDarkTheme;
      const useDualMode = hasLight && hasDark;
      this._currentModeSig.set(useDualMode ? (
        this._isBrowser && this.getSystemPrefersDark() ? 'dark' : 'light'
      ) : 'light');
    }

    //--Step 5: Initialize last applied theme for SSR-safe removal
    this._lastAppliedThemeId = this._currentModeSig() === 'dark'
      ? this._darkThemeId()
      : this._lightThemeId();

    //--Step 6: Apply immediately
    this.applyCurrentMode();

    //--Step 7: Watch system theme if enabled
    if (this._isBrowser && options?.watchSystemMode && this._prefersDarkQuery) {
      this._prefersDarkQuery.addEventListener('change', e => {
        this._currentModeSig.set(e.matches ? 'dark' : 'light');
        this.applyCurrentMode();
        this.persist();
      });
    }
  }
}
