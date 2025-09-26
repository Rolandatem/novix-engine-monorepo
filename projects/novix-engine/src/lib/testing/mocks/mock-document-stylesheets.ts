/**
 * Mocks the 'document.styleSheets' API for unit tests tha rely on CSS class detection.
 *
 * This is used to simulate the presence (or absence) of CSS classes in loaded stylesheets,
 * allowing tests to validate behavior of 'cssClassExists()' and theme fallback logic.
 *
 * @param classesToAdd Array of CSS class name (without leading dot) to simulate as preset in the stylesheet.
 * Each class will be converted to a mock 'CSSStyleRule' with a '.selectorText' like '.theme-name'.
 *
 * @param includeInaccessibleStylesheet If 'true', includes a second stylesheet that throws an exception
 * when attempted to access. This allows coverage of the 'catch' block in 'cssClassExists()' for inaccessible stylesheets.
 */
export function mockDocumentStyleSheets(
  classesToAdd: string[],
  includeInaccessibleStylesheet: boolean = false
): void {

  //--Simulate a stylesheet with accessible CSS rules.
  const accessibleStyleSheet = {
    cssRules: classesToAdd.map(className =>
      Object.setPrototypeOf({
        selectorText: `.${className}`,
        style: {}
      }, CSSStyleRule.prototype)) //--Required to pass 'instanceof CSSStyleRule' checks.
  }

  //--Somulate a stylesheet that throws an exception when accessed.
  const inaccessibleStyleSheet = {
    get cssRules() {
      throw new Error('not allowed to access.')
    }
  }

  //--Mock document.styleSheets with the mocked stylesheets.
  Object.defineProperty(document, 'styleSheets', {
    configurable: true,
    get: () => includeInaccessibleStylesheet
      ? [inaccessibleStyleSheet, accessibleStyleSheet]
      : [accessibleStyleSheet]
  });
}
