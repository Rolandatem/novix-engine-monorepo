import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { NovixEngThemeService } from '../services/theme/novix-eng-theme-service';
import { INovixEngThemeInitOptions } from '../interfaces/INovixEngThemeInitOptions';

/**
 * Provides and initializes the NovixEngine theme service at application startup.
 *
 * This uses Angular's `provideAppInitializer` to:
 * - Run before the first render (flicker-safe theme application).
 * - Execute inside Angular's DI context (true DI, no manual `new`).
 * - Optionally register themes, set initial light/dark themes, and watch for system theme changes.
 *
 * @param options Optional initialization configuration.
 * @returns An `EnvironmentProviders` object for use in `bootstrapApplication` or `importProvidersFrom`.
 *
 * @example
 * // Zero-config setup (uses 'novix-default-light' theme in light mode)
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideNovixEngine()
 *   ]
 * });
 *
 * @example
 * // Single-theme setup (custom theme, no light/dark mode switching)
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideNovixEngine({
 *       registerThemes: [
 *         { id: 'my-theme' }
 *       ],
 *       initialLightTheme: 'my-theme'
 *     })
 *   ]
 * });
 *
 * @example
 * // Dual-mode setup with system preference switching
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideNovixEngine({
 *       registerThemes: [
 *         { id: 'my-light-theme' },
 *         { id: 'my-dark-theme' }
 *       ],
 *       initialLightTheme: 'my-light-theme',
 *       initialDarkTheme: 'my-dark-theme',
 *       watchSystemMode: true
 *     })
 *   ]
 * });
 */
export function provideNovixEngine(options?: INovixEngThemeInitOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    NovixEngThemeService,
    provideAppInitializer(() => {
      const themeService = inject(NovixEngThemeService);
      themeService.initialize(options);
    })
  ]);
}
