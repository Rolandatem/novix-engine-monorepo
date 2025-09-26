export function mockDocumentStyleSheets(
  classesToAdd: string[],
  includeInaccessibleStylesheet: boolean = false
): void {

  //--Cant 'new' up a CSSStyleRule because apparently it's part
  //--of the browser's internal CSS Object Model and instances
  //--are created when it parses stylesheets. The constructor
  //--is blocked to prevent manual instatiation. I wonder why.
  const accessibleStyleSheet = {
    cssRules: classesToAdd.map(className =>
      Object.setPrototypeOf({
        selectorText: `.${className}`,
        style: {}
      }, CSSStyleRule.prototype))
  }

  const inaccessibleStyleSheet = {
    get cssRules() {
      throw new Error('not allowed to access.')
    }
  }

  Object.defineProperty(document, 'styleSheets', {
    configurable: true,
    get: () => includeInaccessibleStylesheet
      ? [inaccessibleStyleSheet, accessibleStyleSheet]
      : [accessibleStyleSheet]
  });
}
