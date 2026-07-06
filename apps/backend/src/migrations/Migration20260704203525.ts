import { Migration } from '@mikro-orm/migrations';

export class Migration20260704203525 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "application" add "status" text not null default 'waiting';`);
    this.addSql(`alter table "application" add constraint "application_status_check" check ("status" in ('waiting', 'proccesed'));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "application" drop constraint "application_status_check";`);
    this.addSql(`alter table "application" drop column "status";`);
  }

}
