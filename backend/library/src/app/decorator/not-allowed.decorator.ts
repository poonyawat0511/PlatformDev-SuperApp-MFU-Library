import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function NotAllowed(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'notAllowed',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value === undefined; // Ensure the field is not present
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} field is not allowed`;
        },
      },
    });
  };
}
