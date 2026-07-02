import { Migration } from '@mikro-orm/migrations';

export class Migration20260702220642 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "application" ("id" uuid not null, "text" varchar(255) not null, "longitude" double precision not null, "latitude" double precision not null, "address" varchar(255) not null, "created_at" timestamptz not null default now(), "user_id" uuid not null, primary key ("id"));`);

    this.addSql(`alter table "application" add constraint "application_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "application" cascade;`);
  }

}
