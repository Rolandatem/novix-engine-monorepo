import { MockInstance, vi } from 'vitest';

/**
 * Creates and applies a mock implementation of 'window.matchMedia' for unit tests.
 *
 * This is useful in jsdom-based test environments where 'matchMedia' is not implemented by default.
 * It allows you to simulate the browser's 'prefers-color-scheme' media query result.
 *
 * @param usDarkMode
 * If `true`, the mock will simulate that the system prefers dark mode (`matches: true`).
 * If `false`, it will simulate t hat the system prefers light mode (`matches: false`).
 *
 * @returns The vitest mock function replacing `window.matchMedia`, so you can make assertions
 * about how it was called in your tests.
 *
 * @example
 * //--Simulate system prefers light mode.
 * const mock = createMockMatchMedia(false);
 * expect(mock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
 *
 * @example
 * //--Simulate system prefers dark mode
 * const mock = createMockMatchMedia(true);
 * expect(mock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
 */
export function createMockMatchMedia(useDarkMode: boolean): MockInstance {
  const mockFn = vi.fn().mockImplementation((query: string) => ({
    matches: useDarkMode,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }));

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockFn
  });

  return mockFn;
}
