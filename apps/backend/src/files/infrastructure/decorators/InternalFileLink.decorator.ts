import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isInternalFileLink', async: false })
export class IsInternalFileLinkConstraint implements ValidatorConstraintInterface {
  private readonly regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]{2,10}$/i;

  validate(value: any) {
    return typeof value === 'string' && this.regex.test(value);
  }

  defaultMessage() {
    return 'Property must be a valid internal file link (uuid.extension)';
  }
}

export function IsInternalFileLink(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsInternalFileLinkConstraint,
    });
  };
}

export function InternalFileLink(
  required?: boolean,
  validationOptions?: ValidationOptions,
) {
  return applyDecorators(
    ApiProperty({
      required,
      example: '550e8400-e29b-41d4-a716-446655440000.webp',
      description: 'A link to an internal file in format uuid.extension',
      type: 'string',
    }),
    //@ts-expect-error custom decorator
    IsInternalFileLink(validationOptions),
  );
}
