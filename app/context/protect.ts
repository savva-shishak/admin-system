import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';

export const secretKey = process.env.DEV_MODE !== 'on' ? v4() : 'secret-key';

export function getPeerId(token: string) {

  const key = token.startsWith('Guest ') ? ('guest' + secretKey): secretKey;
  const tokenLessPrefix = token.replace('Guest ', '').replace('User ', '');

  try {
    return (jwt.verify(tokenLessPrefix, key) as any).peerId;
  } catch (e: any) {
    return null;
  }
}