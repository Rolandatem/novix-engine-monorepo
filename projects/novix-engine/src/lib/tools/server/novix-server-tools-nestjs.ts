import { Request, Response } from 'express';
import { getNovixThemeClassFromCookies } from './novix-server-tools';

export async function injectNovixThemeClassForNest(
  req: Request,
  res: Response,
  angularApp: any,
  fallback?: { light?: string; dark?: string }
) {
  const response = await angularApp.handle(req);
  if (!response?.body) return;

  const html = await response.text();
  const themeClass = getNovixThemeClassFromCookies(req.headers.cookie, fallback);
  const themedHtml = html.replace('<html', `<html class="${themeClass}"`);

  for (const [key, value] of Object.entries(response.headers)) {
    try {
      res.setHeader(key, value as string);
    } catch (err) {
      console.warn(`[NovixEngine SSR] Skipped invalid header "${key}": ${err}`);
    }
  }

  res.status(response.status).send(themedHtml);
}
