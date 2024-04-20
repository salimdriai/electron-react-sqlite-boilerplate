import crypto from 'crypto';

const getKey = (secretKey: string) =>
  crypto.createHash('sha512').update(secretKey).digest('hex').substring(0, 32);

const getEncryptionIV = (secretIv: string) =>
  crypto.createHash('sha512').update(secretIv).digest('hex').substring(0, 16);

// Encrypt data
export function encryptData(data: string, secretKey: string, secretIv: string) {
  const encryptionIV = getEncryptionIV(secretIv);
  const key = getKey(secretKey);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, encryptionIV);
  return Buffer.from(
    cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
  ).toString('base64'); // Encrypts data and converts to hex and base64
}

// Decrypt data
export function decryptData(
  encryptedData: string,
  secretKey: string,
  secretIv: string
) {
  const buff = Buffer.from(encryptedData, 'base64');
  const encryptionIV = getEncryptionIV(secretIv);
  const key = getKey(secretKey);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, encryptionIV);
  return (
    decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
    decipher.final('utf8')
  ); // Decrypts data and converts to utf8
}
