import { Migration } from '@mikro-orm/migrations';

export class Migration20260702182052 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_username_unique";`);
    this.addSql(`alter table "user" drop column "username";`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "user" add "username" varchar(255) not null;`);
    this.addSql(`alter table "user" add constraint "user_username_unique" unique ("username");`);
  }

}
