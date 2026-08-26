import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'admin_session';
const SESSION_VALUE = 'authenticated';

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || '';
}

export function createAdminToken() {
  return createHmac('sha256', getSecret()).update(SESSION_VALUE).digest('hex');
}

export function isValidAdminToken(token?: string) {
  if (!token) return false;
  const expected = createAdminToken();
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
