import { Migration } from '@mikro-orm/migrations';

export class Migration20260702203517 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "user" alter column "created_at" set default now();`);
    this.addSql(`alter table "user" alter column "updated_at" set default now();`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "user" alter column "created_at" drop default;`);
    this.addSql(`alter table "user" alter column "updated_at" drop default;`);
  }

}
