import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IncludeSome(
  array: Array<string>,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IncludeSome',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value || !Array.isArray(value)) return false;
          return value.every((item) => array.includes(item));
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contains ${array.join(', ')} values`;
        },
      },
    });
  };
}
