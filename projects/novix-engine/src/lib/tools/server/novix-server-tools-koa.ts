import { Context } from 'koa';
import { getNovixThemeClassFromCookies } from './novix-server-tools';

export async function injectNovixThemeClassForKoa(
  ctx: Context,
  angularApp: any,
  fallback?: { light?: string; dark?: string }
) {
  const response = await angularApp.handle(ctx.req);
  if (!response?.body) {
    ctx.status = 404;
    ctx.body = 'Not Found';
    return;
  }

  const html = await response.text();
  const themeClass = getNovixThemeClassFromCookies(ctx.headers.cookie, fallback);
  const themedHtml = html.replace('<html', `<html class="${themeClass}"`);

  ctx.status = response.status;
  ctx.body = themedHtml;

  for (const [key, value] of Object.entries(response.headers)) {
    try {
      ctx.set(key, value as string);
    } catch (err) {
      console.warn(`[NovixEngine SSR] Skipped invalid header "${key}": ${err}`);
    }
  }
}
