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

const secretKey = crypto.randomBytes(32);
const initializationVector = crypto.randomBytes(16);

export const encryptOauthState = (jsonObject: { user_id: string, redirect_url: string}) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, initializationVector);
  let encrypted = cipher.update(JSON.stringify(jsonObject), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export const decryptOauthState = (encrypted: string): { user_id: string, redirect_url: string} => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, initializationVector);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}
