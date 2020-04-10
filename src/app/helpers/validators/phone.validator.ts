import { AbstractControl, ValidatorFn } from '@angular/forms';
import libphonenumber from 'google-libphonenumber';

export class PhoneValidator {
  // Inspired on: https://github.com/yuyang041060120/ng2-validation/blob/master/src/equal-to/validator.ts
  static validCountryPhone = (): ValidatorFn => {
    return (phoneControl: AbstractControl): { [key: string]: boolean } => {
      if (phoneControl.value !== '') {
        try {
          const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
          let phoneNumber = '' + phoneControl.value + '',
            number = phoneUtil.parse(phoneNumber, 'MA'),
            isValidNumber = phoneUtil.isValidNumber(number);
          if (isValidNumber) {
            return null;
          }
        } catch (e) {
          return {
            validCountryPhone: true,
          };
        }
        return {
          validCountryPhone: true,
        };
      } else {
        return null;
      }
    };
  };
}
