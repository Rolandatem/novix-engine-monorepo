import * as cookie from 'cookie';

/**
 * Determines the correct NovixEngine theme class to inject into the <html> tag
 * during server-side rendering, based on cookies set by the client.
 *
 * This function is used in SSR middleware to ensure the correct theme is applied
 * before hydration, preventing flicker and ensuring visual consistency.
 *
 * It reads the following cookies:
 * - `novix.theme.mode`: either `'light'` or `'dark'`
 * - `novix.theme.light`: theme ID to use in light mode
 * - `novix.theme.dark`: theme ID to use in dark mode
 *
 * If no cookies are present, it falls back to the provided `fallback` values,
 * or defaults to `'novix-default-light'` if nothing is specified.
 *
 * @param cookieHeader The raw `cookie` header string from the incoming request.
 * @param fallback Optional fallback theme IDs for light and dark modes.
 * @returns The CSS class name to inject into the `<html>` tag.
 *
 * @example
 * const themeClass = getNovixThemeClassFromCookies(req.headers.cookie, {
 *   light: 'my-light-theme',
 *   dark: 'my-dark-theme'
 * });
 */
function getNovixThemeClassFromCookies (
  cookieHeader: string | undefined,
  fallback?: { light?: string; dark?: string }
): string {
  //--Parse the cookie header into key-value pairs.
  const parsed = cookie.parse(cookieHeader || '');

  //--Determine t he current mode ('light' or 'dark'), defaulting to 'light'.
  const mode = parsed['novix.theme.mode'] ?? 'light';

  //--Select the theme ID based on the mode.
  const themeId = mode === 'dark'
    ? parsed['novix.theme.dark']
    : parsed['novix.theme.light'];

  //--Return the theme ID from cookies if available, otherwise fall back to provided values
  //--or default to 'novix-default-light'.
  return themeId || (mode === 'dark' ? fallback?.dark : fallback?.light) || 'novix-default-light';
}

export {
  getNovixThemeClassFromCookies
}
