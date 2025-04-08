// script.js
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Constants
const JWT_SECRET = 'kalvium_secret'; // Use a constant string for now
const ENCRYPTION_KEY = crypto.randomBytes(32); // AES-256 needs 32-byte key
const IV = crypto.randomBytes(16); // AES-CBC needs 16-byte IV

const encrypt = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return { token: encrypted, iv: IV.toString('hex') };
};

const decrypt = ({ token, iv }) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(token, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return jwt.verify(decrypted, JWT_SECRET);
};

module.exports = {
  encrypt,
  decrypt
};