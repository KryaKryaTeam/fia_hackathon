import { ApplicationEntity } from '@/application/domain/entities/Application.entity';
import { Mapper } from '@/common/infrastructure/Mapper';
import { ApplicationSchema } from '@/schemas/Application.schema';
import { UserSchema } from '@/schemas/User.schema';
import { Reference } from '@mikro-orm/core';

export class ApplicationMapper extends Mapper<
  ApplicationSchema,
  ApplicationEntity
> {
  public override toEntity(schema: ApplicationSchema): ApplicationEntity {
    const user = schema.user.unwrap();
    return ApplicationEntity.load({
      id: schema.id,
      text: schema.text,
      address: schema.address,
      createdAt: schema.createdAt,
      location: {
        latitude: schema.latitude,
        longitude: schema.longitude,
      },
      requester: {
        id: schema.user.id,
        email: user.email,
        fullName: [user.firstName, user.lastName, user.surName]
          .filter(Boolean)
          .join(' '),
      },
    });
  }
  public override toSchema(entity: ApplicationEntity): ApplicationSchema {
    const schema = new ApplicationSchema();

    schema.id = entity.id;
    schema.text = entity.text;
    schema.longitude = entity.location.value.longitude;
    schema.latitude = entity.location.value.latitude;
    schema.address = entity.address.value;
    schema.user = Reference.createFromPK(UserSchema, entity.requester.value.id);
    schema.createdAt = entity.createdAt;
    return schema;
  }
}
