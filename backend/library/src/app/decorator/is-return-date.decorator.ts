import { registerDecorator, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsReturnDateAllowed', async: false })
export class IsReturnDateAllowedConstraint implements ValidatorConstraintInterface {
  validate(returnDate: any, args: ValidationArguments) {
    const object = args.object as any;
    return object.status !== 'BORROW' || returnDate === undefined || returnDate === null || returnDate === '';
  }

  defaultMessage(args: ValidationArguments) {
    return 'If status is BORROW, returnDate must not be provided.';
  }
}

export function IsReturnDateAllowed() {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'If status is BORROW, returnDate must not be provided.',
      },
      constraints: [],
      validator: IsReturnDateAllowedConstraint,
    });
  };
}
