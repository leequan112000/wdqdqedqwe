import crypto from 'crypto';

const base64URLEncode = (str: any) => {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

const sha256 = (buffer: crypto.BinaryLike) => {
  return crypto.createHash('sha256').update(buffer).digest();
}

export const codeVerifier = base64URLEncode(crypto.randomBytes(32));
export const codeChallenge = base64URLEncode(sha256(codeVerifier));