import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { usernameValidation } from 'src/util/validateArg';

@ValidatorConstraint({ name: 'customText', async: false })
export class UsernameFormat implements ValidatorConstraintInterface {
  validate(username: string, args: ValidationArguments) {
    return usernameValidation(username);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Usernameの書式が不正です';
  }
}
