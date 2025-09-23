import { Request, Response, NextFunction } from 'express';
import { getNovixThemeClassFromCookies } from './novix-server-tools';

/**
 * Express middleware that injects the correct NovixEngine theme class into the <html> tag
 * of the SSR-rendered Angular response, based on cookies and optional fallback themes.
 *
 * This middleware replaces the default Angular SSR handler and should be used as the final
 * response writer in your Express server setup.
 *
 * @param fallback Optional fallback theme IDs for light and dark modes.
 * @returns An Express middleware function.
 *
 * @example
 * replace express default angular code, something like:
 * app.use((req, res, next) => {
 * angularApp
 *   .handle(req)
 *   .then((response) =>
 *     response ? writeResponseToNodeResponse(response, res) : next(),
 *   )
 *   .catch(next);
 * });
 *
 * WITH
 *
 * app.set('angularApp', angularApp);
 * app.use(injectNovixThemeClassForExpress({
 *   light: 'novix-default-light',
 *   dark: 'novix-default-dark'
 * }));
 */
function injectNovixThemeClassForExpress(
  fallback?: { light?: string, dark?: string}) {

  return async function(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    //--Retrieve the Angular SSR engine instance from the Express app context
    const angularApp = req.app.get('angularApp');

    //--Skip if no SSR engine.
    if (!angularApp?.handle) { return next(); }

    try {
      //--Render Angular app to HTML.
      const response = await angularApp.handle(req);

      //--Skip if no SSR response returned.
      if (!response?.body) { return next(); }

      //--Get html from response.
      const html = await response.text();
      //--Determine correct-ish theme class to use. See method details for more info.
      const themeClass = getNovixThemeClassFromCookies(req.headers.cookie, fallback);
      //--Inject theme CSS into html object.
      const themedHtml = html.replace('<html', `<html class=${themeClass}`);

      //--Set SSR response headers manually to avoid Express crashing on invalid characters.
      //--Angular's SSR engine may emit headers (e.g. "append", "set-cookie") with values that contain
      //--newline characters or other formatting that Express rejects. Instead of passing the entire
      //--headers object blindly, we iterate and set each header individually, catching and skipping
      //--any that would trigger a "ERR_INVALID_CHAR" or similar runtime error.
      for (const [key, value] of Object.entries(response.headers)) {
        try {
          res.setHeader(key, value as string);
        } catch (err) {
          console.warn(`[NovixEngine SSR] Skipped invalid header "${key}": ${err}`);
        }
      }

      //--Send modified HTML response.
      res
        .status(response.status)
        .send(themedHtml);
    } catch (err) {
      next(err);
    }
  }
}

export { injectNovixThemeClassForExpress }
