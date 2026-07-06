import { Migration } from '@mikro-orm/migrations';

export class Migration20260706221434 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "user" drop column "first_name", drop column "last_name", drop column "sur_name";`);
    this.addSql(`alter table "user" add "full_name" varchar(255) null, add "address" varchar(255) null, add "phone" varchar(255) null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "user" drop column "full_name", drop column "address", drop column "phone";`);
    this.addSql(`alter table "user" add "first_name" varchar(255) null, add "last_name" varchar(255) null, add "sur_name" varchar(255) null;`);
  }

}
