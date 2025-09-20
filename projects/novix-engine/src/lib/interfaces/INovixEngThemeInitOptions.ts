import { INovixEngRegisteredTheme } from "./INovixEngRegisteredTheme";

/**
 * Interface for NovixEngine theme initialization options.
 * Allows developers to configure themes and behavior at startup.
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
   * If true, the engine will automatically switch themes
   * when the system's color scheme changes.
   */
  watchSystemTheme?: boolean;
}
