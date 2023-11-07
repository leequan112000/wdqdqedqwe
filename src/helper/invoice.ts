import { customAlphabet } from "nanoid";

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 18);
export function generateInvoiceNumber(isBiotech: boolean) {
  return isBiotech ? `binv_${nanoid()}` : `in_${nanoid()}`;
}