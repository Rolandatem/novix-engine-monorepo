import { FastifyRequest, FastifyReply } from 'fastify';
import { getNovixThemeClassFromCookies } from './novix-server-tools';

export async function injectNovixThemeClassForFastify(
  req: FastifyRequest,
  reply: FastifyReply,
  angularApp: any,
  fallback?: { light?: string; dark?: string }
) {
  const response = await angularApp.handle(req);
  if (!response?.body) return reply.callNotFound();

  const html = await response.text();
  const themeClass = getNovixThemeClassFromCookies(req.headers.cookie, fallback);
  const themedHtml = html.replace('<html', `<html class="${themeClass}"`);

  for (const [key, value] of Object.entries(response.headers)) {
    try {
      reply.header(key, value as string);
    } catch (err) {
      console.warn(`[NovixEngine SSR] Skipped invalid header "${key}": ${err}`);
    }
  }

  reply.status(response.status).send(themedHtml);
}
