import { Request, ResponseToolkit } from '@hapi/hapi';
import { getNovixThemeClassFromCookies } from './novix-server-tools';

export async function injectNovixThemeClassForHapi(
  req: Request,
  h: ResponseToolkit,
  angularApp: any,
  fallback?: { light?: string; dark?: string }
) {
  const response = await angularApp.handle(req.raw.req);
  if (!response?.body) return h.continue;

  const html = await response.text();
  const themeClass = getNovixThemeClassFromCookies(req.headers.cookie, fallback);
  const themedHtml = html.replace('<html', `<html class="${themeClass}"`);

  const reply = h.response(themedHtml).code(response.status);
  for (const [key, value] of Object.entries(response.headers)) {
    try {
      reply.header(key, value as string);
    } catch (err) {
      console.warn(`[NovixEngine SSR] Skipped invalid header "${key}": ${err}`);
    }
  }

  return reply;
}
