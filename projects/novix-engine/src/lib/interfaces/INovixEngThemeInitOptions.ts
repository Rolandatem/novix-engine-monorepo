import { INovixEngRegisteredTheme } from "./INovixEngRegisteredTheme";

/**
 * Interface for NovixEngine theme initialization options.
 * Allows developers to configure themes and behavior at startup.
 *
 * By default, NovixEngine assumes single-theme usage in light mode.
 * Developers can opt into light/dark mode duality by providing both
 * `initialLightTheme` and `initialDarkTheme`, and optionally enabling
 * `watchSystemMode` to respond to system preference changes.
 */
export interface INovixEngThemeInitOptions {
  /**
   * Optional list of themes to register at initialization.
   * Each theme is identified by an ID.
   */
  registerThemes?: INovixEngRegisteredTheme[];

  /**
   * Optional ID of the theme to use in light mode.
   * If not provided, defaults to 'novix-default-light'.
   */
  initialLightTheme?: string;

  /**
   * Optional ID of the theme to use in dark mode.
   * If not provided, defaults to 'novix-default-dark'.
   */
  initialDarkTheme?: string;

  /**
   * If true, the engine will automatically switch between light and dark mode
   * when the system's color scheme changes (via prefers-color-scheme).
   */
  watchSystemMode?: boolean;
}
