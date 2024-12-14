import { customType } from "drizzle-orm/pg-core";
import CryptoJS from "crypto-js";
import {env} from "~/env";

const iv = CryptoJS.enc.Utf8.parse(env.IV_KEY); // Move IV to env variable
const key = CryptoJS.enc.Utf8.parse(env.CRYPTO_KEY);
// Helper functions for encryption/decryption

export const encrypt = (value: string) => {
  if (!value) return '';
  try {
    return CryptoJS.AES.encrypt(value, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed');
  }
};


const decrypt = (value: string) => {
  if (!value) return '';
  try {
    const decrypted = CryptoJS.AES.decrypt(value, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    if (!result) throw new Error('Decryption resulted in empty string');
    return result;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed');
  }
};


export const encryptedInteger = customType<{
  data: number;
  driverData: string;
}>({
  dataType: () => `text`,
  fromDriver: (value: string): number => {
    if (value === "NaN") return 0;
    const decrypted = decrypt(value);
    return decrypted ? parseInt(decrypted, 10) : 0;
  },
  toDriver: (value: number)=> {
    return encrypt(value.toString());
  },
});

export const encryptedText = customType<{
  data: string;
  driverData: string;
}>({
  dataType: () => `text`,
  fromDriver: (value: string): string => {
    return value ? decrypt(value) : "";
  },
  toDriver: (value: string): string => {
    return encrypt(value);
  },
});

export const encryptedBoolean = customType<{
  data: boolean;
  driverData: string;
}>({
  dataType: () => `text`,
  fromDriver: (value: string): boolean => {
    return value ? decrypt(value) === "true" : false;
  },
  toDriver: (value: boolean)=> {
    return encrypt(value.toString()) ;
  },
});

export const encryptedDate = customType<{
  data: Date;
  driverData: string;
}>({
  dataType: () => `text`,
  fromDriver: (value: string): Date => {
    return value ? new Date(decrypt(value)) : new Date();
  },
  toDriver: (value: Date | string | number): string => {
    const date = value instanceof Date ? value : new Date(value);
    return encrypt(date.toISOString());
  },
}); 