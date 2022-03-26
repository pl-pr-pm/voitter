import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import {
  passwordValidation,
  voitterUsernameValidation,
} from 'src/util/validateArg';

@ValidatorConstraint({ name: 'customText', async: false })
export class VoitterUsernameFormat implements ValidatorConstraintInterface {
  validate(username: string, args: ValidationArguments) {
    return voitterUsernameValidation(username);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Usernameの書式が不正です';
  }
}

export class PasswordFormat implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    return passwordValidation(password);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Passwordの書式が不正です';
  }
}
