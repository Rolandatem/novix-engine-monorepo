/**
 * Registered theme structure.
 */
export interface INovixEngRegisteredTheme {
  /** CSS class name generated in SCSS */
  id: string;

  /**
   * Optional token map for the theme.
   * This can be used for advanced scenarios like dynamic style generation.
   */
  map?: Record<string, any>;
}
