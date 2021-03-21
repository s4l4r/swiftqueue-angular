
export class VerificationCode {
  code: string;
  phoneNumber: string;
  generationTimestamp;

  constructor(code?: string, phoneNumber?: string, generationTimestamp?: string) {
    this.code = code != null ? code : '';
    this.phoneNumber = phoneNumber != null ? phoneNumber : '';
    this.generationTimestamp = generationTimestamp != null ? generationTimestamp : '';
  }
}
