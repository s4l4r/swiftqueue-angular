import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptionService {
  key = 'Zr4u7w!z%C*F-JaNdRgUkXp2s5v8y/A?D(G+KbPeShVmYq3t6w9z$C&F)H@McQfT';
  constructor() {}

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.key).toString();
  }

  decrypt(value: string): string {
    return CryptoJS.AES.decrypt(value, this.key).toString(CryptoJS.enc.Utf8);
  }
}
