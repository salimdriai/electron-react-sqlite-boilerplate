import crypto from 'crypto';
import { secretKey, secretIv, ecnryptionMethod } from './config';

const key = crypto
  .createHash('sha512')
  .update(secretKey)
  .digest('hex')
  .substring(0, 32);
const encryptionIV = crypto
  .createHash('sha512')
  .update(secretIv)
  .digest('hex')
  .substring(0, 16);

// Encrypt data
export function encryptData(data: string) {
  const cipher = crypto.createCipheriv(ecnryptionMethod, key, encryptionIV);
  return Buffer.from(
    cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
  ).toString('base64'); // Encrypts data and converts to hex and base64
}

// Decrypt data
export function decryptData(encryptedData: string) {
  const buff = Buffer.from(encryptedData, 'base64');
  const decipher = crypto.createDecipheriv(ecnryptionMethod, key, encryptionIV);
  return (
    decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
    decipher.final('utf8')
  ); // Decrypts data and converts to utf8
}
