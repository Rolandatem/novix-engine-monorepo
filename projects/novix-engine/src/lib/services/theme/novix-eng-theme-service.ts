import { Injectable, Inject, PLATFORM_ID, Renderer2, RendererFactory2, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { INovixEngThemeInitOptions } from '../../interfaces/INovixEngThemeInitOptions';
import { INovixEngRegisteredTheme } from '../../interfaces/INovixEngRegisteredTheme';
import * as cookie from 'cookie';

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
  private readonly renderer: Renderer2;

  /** Root HTML element reference */
  private rootEl: HTMLElement | null = null;

  /** Media query for system dark mode preference */
  private prefersDarkQuery?: MediaQueryList;

  /** Internal registry of themes */
  private themes = new Map<string, INovixEngRegisteredTheme>();

  /** Currently selected light theme ID */
  private lightThemeId?: string;

  /** Currently selected dark theme ID */
  private darkThemeId?: string;

  /** Current mode signal ('light' or 'dark') */
  private currentModeSig = signal<'light' | 'dark' | undefined>(undefined);

  /** Current theme ID signal for the active mode */
  private currentThemeIdSig = signal<string>('novix-default-light');

  //===========================================================================================================================
  // PUBLIC PROPERTIES
  //===========================================================================================================================
  /** Public readonly signals */
  public readonly mode = this.currentModeSig.asReadonly();
  public readonly currentThemeId = this.currentThemeIdSig.asReadonly();

  //===========================================================================================================================
  // CONSTRUCTOR
  //===========================================================================================================================
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    rendererFactory: RendererFactory2
  ) {
    this._isBrowser = isPlatformBrowser(platformId);
    this.renderer = rendererFactory.createRenderer(null, null);

    if (this._isBrowser) {
      this.rootEl = this.renderer.selectRootElement('html', true);
      this.prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

      //-- Warn if cookie library is missing
      if (!cookie || typeof cookie.parse !== 'function' || typeof cookie.serialize !== 'function') {
        console.warn(
          `[NovixEngine] Missing peer dependency "cookie". Install it with \`npm install cookie\` to enable theme persistence.
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
    if (!this._isBrowser || !this.rootEl || !this.lightThemeId || !this.darkThemeId) return;

    const targetId = this.currentModeSig() === 'dark' ? this.darkThemeId : this.lightThemeId;

    // Remove both, then add current
    this.renderer.removeClass(this.rootEl, this.lightThemeId);
    this.renderer.removeClass(this.rootEl, this.darkThemeId);
    this.renderer.addClass(this.rootEl, targetId);

    //-- Hard Fail: CSS not loaded
    const style = getComputedStyle(this.rootEl);
    if (!style.getPropertyValue('--primary').trim()) {
      throw new Error(
        `[NovixEngine] Theme "${targetId}" is active but no CSS variables were found.
        This usually means its SCSS file was not imported into your global styles.scss.
        Import the theme SCSS before using it.`
      );
    }

    //--Graceful Fail: warn if theme not registered.
    if (!this.themes.has(targetId)) {
      console.warn(`[NovixEngine] Theme "${targetId}" is not registered. Did you forget to register it?`);
    }

    // Update signal
    this.currentThemeIdSig.set(targetId);
  }

  /** Returns true if the system prefers dark mode */
  private getSystemPrefersDark(): boolean {
    return !!this.prefersDarkQuery?.matches;
  }

  /** Persists current theme selections to localStorage */
  private persist(): void {
    if (!this._isBrowser) return;

    const options = { path: '/', maxAge: 3153600 }; //--1 year
    document.cookie = cookie.serialize(NOVIX_STORAGE_KEYS.light, this.lightThemeId ?? '', options);
    document.cookie = cookie.serialize(NOVIX_STORAGE_KEYS.dark, this.darkThemeId ?? '', options);

    const mode = this.currentModeSig();
    document.cookie = cookie.serialize(NOVIX_STORAGE_KEYS.mode, mode ?? '', {
      path: '/',
      maxAge: mode ? 3153600 : 0
    });
  }

  /** Restores theme selections from localStorage */
  private restore(): void {
    if (!this._isBrowser) return;

    const parsed = cookie.parse(document.cookie);

    const light = parsed[NOVIX_STORAGE_KEYS.light] || undefined;
    const dark = parsed[NOVIX_STORAGE_KEYS.dark] || undefined;
    const mode = parsed[NOVIX_STORAGE_KEYS.mode] as 'light' | 'dark' | undefined;

    if (light && this.themes.has(light)) { this.lightThemeId = light; }
    if (dark && this.themes.has(dark)) { this.darkThemeId = dark; }
    if (mode === 'light' || mode === 'dark') { this.currentModeSig.set(mode); }
  }

  //===========================================================================================================================
  // PUBLIC METHODS
  //===========================================================================================================================

  /**
   * Registers a theme with the engine. WARNING: This method is only intended to be used by the provider, any use
   * outside of that context is unsupported and may lead to unexpected behavior.
   * @param id Unique identifier for the theme.
   * @param map Optional token map for the theme.
   */
  public registerTheme(id: string, map?: Record<string, any>): void {
    this.themes.set(id, { id, map });
  }

  /**
   * Returns all registered themes.
   */
  public getRegisteredThemes(): INovixEngRegisteredTheme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Sets the theme to use in light mode.
   */
  public setLightTheme(id: string): void {
    this.lightThemeId = id;
    this.persist();
  }

  /**
   * Sets the theme to use in dark mode.
   */
  public setDarkTheme(id: string): void {
    this.darkThemeId = id;
    this.persist();
  }

  /**
   * Returns the current mode ('light' or 'dark').
   */
  public getCurrentMode(): 'light' | 'dark' {
    return this.currentModeSig() ?? 'light';
  }

  /**
   * Returns the current theme ID for the active mode.
   */
  public getCurrentThemeId(): string {
    return this.currentThemeIdSig();
  }

  /**
   * Returns both light and dark theme IDs.
   */
  public getActiveThemeIds(): { light: string; dark: string } {
    return { light: this.lightThemeId!, dark: this.darkThemeId! };
  }

  /**
   * Toggles between light and dark mode.
   */
  public toggleMode(): void {
    this.currentModeSig.update(m => m === 'dark' ? 'light' : 'dark');
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
    // Register provided themes, or defaults if none provided
    if (options?.registerThemes?.length) {
      options?.registerThemes?.forEach(t => this.registerTheme(t.id, t.map));
    } else {
      //--Zero-config: assume defaults are set in global styles.scss.
      this.registerTheme('novix-default-light');
      this.registerTheme('novix-default-dark');
    }

    // Restore persisted selections
    this.restore();

    // Apply passed-in overrides
    if (options?.initialLightTheme) this.setLightTheme(options.initialLightTheme);
    if (options?.initialDarkTheme) this.setDarkTheme(options.initialDarkTheme);

    // Ensure defaults
    if (!this.lightThemeId) this.lightThemeId = 'novix-default-light';
    if (!this.darkThemeId) this.darkThemeId = 'novix-default-dark';

    // Decide mode: persisted > system > light
    if (!this.currentModeSig()) {
      this.currentModeSig.set(
        this._isBrowser && this.getSystemPrefersDark() ? 'dark' : 'light'
      );
    }

    // Apply immediately
    this.applyCurrentMode();

    // Watch system theme if enabled
    if (this._isBrowser && options?.watchSystemTheme && this.prefersDarkQuery) {
      this.prefersDarkQuery.addEventListener('change', e => {
        this.currentModeSig.set(e.matches ? 'dark' : 'light');
        this.applyCurrentMode();
        this.persist();
      });
    }
  }
}
