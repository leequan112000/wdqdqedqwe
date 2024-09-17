import crypto from 'crypto';
import { env } from '../env';

// Ensure the key is 32 bytes (256 bits) long
const ENCRYPTION_KEY = Buffer.from(env.AES_256_GCM_KEY || '', 'hex');
const FIXED_IV = Buffer.from(env.AES_256_GCM_IV || '', 'hex');

const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const ALGORITHM = 'aes-256-gcm';

export function encrypt(data?: any): string {
  if (!data || typeof data != 'string') return '';

  try {
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, FIXED_IV);
    // Encrypt the data
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // Get the authentication tag
    const authTag = cipher.getAuthTag();
    // Return IV + Auth Tag + Encrypted data
    return FIXED_IV.toString('hex') + authTag.toString('hex') + encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
}

export function decrypt(encryptedData?: any): string {
  if (!encryptedData || typeof encryptedData !== 'string') return '';

  try {
    // Extract IV, Auth Tag, and encrypted data
    const iv = Buffer.from(encryptedData.slice(0, IV_LENGTH * 2), 'hex');
    const authTag = Buffer.from(
      encryptedData.slice(IV_LENGTH * 2, IV_LENGTH * 2 + AUTH_TAG_LENGTH * 2),
      'hex',
    );
    const encryptedText = encryptedData.slice(
      IV_LENGTH * 2 + AUTH_TAG_LENGTH * 2,
    );
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    // Decrypt the data
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return encryptedData;
  }
}

export function isEncrypted(data?: string): boolean {
  if (
    typeof data !== 'string' ||
    data.length < (IV_LENGTH + AUTH_TAG_LENGTH) * 2
  ) {
    return false;
  }

  try {
    const iv = Buffer.from(data.slice(0, IV_LENGTH * 2), 'hex');
    const authTag = Buffer.from(
      data.slice(IV_LENGTH * 2, IV_LENGTH * 2 + AUTH_TAG_LENGTH * 2),
      'hex',
    );
    const encryptedText = data.slice(IV_LENGTH * 2 + AUTH_TAG_LENGTH * 2);

    // Check if the IV and authTag are valid buffers
    if (iv.length !== IV_LENGTH || authTag.length !== AUTH_TAG_LENGTH) {
      return false;
    }

    // Attempt to create a decipher to see if it throws an error
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    decipher.update(encryptedText, 'hex', 'utf8');
    decipher.final('utf8');

    return true;
  } catch (error) {
    return false;
  }
}
