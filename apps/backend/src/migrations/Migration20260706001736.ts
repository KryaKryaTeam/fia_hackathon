import { Migration } from '@mikro-orm/migrations';

export class Migration20260706001736 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "file_relation" add "application_id" uuid not null;`);
    this.addSql(`alter table "file_relation" add constraint "file_relation_application_id_foreign" foreign key ("application_id") references "application" ("id") on delete cascade;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "file_relation" drop constraint "file_relation_application_id_foreign";`);

    this.addSql(`alter table "file_relation" drop column "application_id";`);
  }

}
