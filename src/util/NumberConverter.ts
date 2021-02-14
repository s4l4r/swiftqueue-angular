import {Injectable} from '@angular/core';

@Injectable()
export class NumberConverter {
  // @ts-ignore
  convertFromPersian = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  // @ts-ignore
  convertFromArabic = s => s.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
}
