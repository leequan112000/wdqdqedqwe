import crypto from 'crypto';

// Ensure the key is 32 bytes (256 bits) long
const ENCRYPTION_KEY = Buffer.from(process.env.AES_256_GCM_KEY || '', 'hex');
const FIXED_IV = Buffer.from(process.env.AES_256_GCM_IV || '', 'hex');

if (ENCRYPTION_KEY.length !== 32) {
  console.log(process.env);
  throw new Error(
    `AES_256_GCM_KEY must be 32 bytes (64 hexadecimal characters) long, got ${process.env.toString}`,
  );
}

if (FIXED_IV.length !== 16) {
  console.log(FIXED_IV);
  throw new Error(
    `AES_256_GCM_IV must be 16 bytes (32 hexadecimal characters) long, got ${FIXED_IV.length}`,
  );
}

const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const ALGORITHM = 'aes-256-gcm';

export function encrypt(data?: any): string {
  if (!data || typeof data != 'string') {
    return '';
  }

  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, FIXED_IV);
  // Encrypt the data
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // Get the authentication tag
  const authTag = cipher.getAuthTag();
  // Return IV + Auth Tag + Encrypted data
  return FIXED_IV.toString('hex') + authTag.toString('hex') + encrypted;
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
    return encryptedData; // or throw an error, depending on your error handling strategy
  }
}

export function generatePseudonym(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}
