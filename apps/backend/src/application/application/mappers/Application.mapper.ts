import { ApplicationEntity } from '@/application/domain/entities/Application.entity';
import { Entity } from '@/common/domain/Entity';
import { Mapper } from '@/common/infrastructure/Mapper';
import { ApplicationSchema } from '@/schemas/Application.schema';
import { UserSchema } from '@/schemas/User.schema';
import { PlainObject, Reference, wrap } from '@mikro-orm/core';

export class ApplicationMapper extends Mapper<
  ApplicationSchema,
  ApplicationEntity
> {
  public override toEntity(schema: ApplicationSchema): ApplicationEntity {
    return ApplicationEntity.load({
      id: schema.id,
      text: schema.text,
      address: schema.address,
      createdAt: schema.createdAt,
      location: {
        latitude: schema.latitude,
        longitude: schema.longitude,
      },
      pdfFile: undefined,
      status: schema.status,
      requester: {
        id: schema.user.id,
        email: schema.user.email,
        fullName: [schema.user.fullName].filter(Boolean).join(' '),
        address: schema.user.address,
        phone: schema.user.phone,
      },
    });
  }
  public override toSchema(entity: ApplicationEntity) {
    const schema = new ApplicationSchema();

    schema.id = entity.id;
    schema.text = entity.text;
    schema.longitude = entity.location.value.longitude;
    schema.latitude = entity.location.value.latitude;
    schema.address = entity.address.value;
    schema.user = Reference.createFromPK(
      UserSchema,
      entity.requester.value.id,
    ) as unknown as UserSchema;
    schema.createdAt = entity.createdAt;
    schema.status = entity.status;
    return schema;
  }
}
