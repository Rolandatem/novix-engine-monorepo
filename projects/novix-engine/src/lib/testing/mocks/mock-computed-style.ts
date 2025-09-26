import { vi } from "vitest";

/**
 * Simulates whether a theme is included in the application. Returns values
 * for specified variables when requested. Can also be used to set up that
 * no themes were included by using setting the <code>noThemesIncluded</code>
 * property to true.
 * @param noThemesIncluded Flag to simulate no themes included in application.
 */
export function mockComputedStyle(
  noThemesIncluded: boolean = false
) {
  vi.stubGlobal('getComputedStyle', () => ({
    getPropertyValue: (prop: string) => {
      if (noThemesIncluded) { return ''; }

      if (prop === '--primary') { return 'fake-color'; }
      return '';
    }
  }))
}
