export abstract class Mapper<Schema, Entity> {
  public abstract toEntity(schema: Schema): Entity;
  public abstract toSchema(entity: Entity): Schema;
}
