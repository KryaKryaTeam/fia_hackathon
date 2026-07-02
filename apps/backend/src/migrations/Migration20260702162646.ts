import { Migration } from '@mikro-orm/migrations';

export class Migration20260702162646 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "file" ("url" varchar(255) not null, "mime_type" varchar(255) not null, "size" int not null, "slot" varchar(255) not null, primary key ("url"));`);

    this.addSql(`create table "user" ("id" uuid not null, "username" varchar(255) not null, "email" varchar(255) not null, "avatar_url" varchar(255) not null default 'https://....', "first_name" varchar(255) null, "last_name" varchar(255) null, "sur_name" varchar(255) null, "Role" text not null default 'USER', "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_username_unique" unique ("username");`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "file_relation" ("id" uuid not null default gen_random_uuid(), "file_url" varchar(255) not null, "slot" varchar(255) not null, "user_id" uuid not null, primary key ("id"));`);

    this.addSql(`create table "authorization_provider" ("id" uuid not null default gen_random_uuid(), "type" text not null, "provider_id" varchar(255) null, "user_id" uuid not null, primary key ("id"));`);

    this.addSql(`alter table "user" add constraint "user_Role_check" check ("Role" in ('USER', 'ADMIN'));`);

    this.addSql(`alter table "file_relation" add constraint "file_relation_file_url_foreign" foreign key ("file_url") references "file" ("url") on delete cascade;`);
    this.addSql(`alter table "file_relation" add constraint "file_relation_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;`);

    this.addSql(`alter table "authorization_provider" add constraint "authorization_provider_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;`);
    this.addSql(`alter table "authorization_provider" add constraint "authorization_provider_type_check" check ("type" in ('GOOGLE'));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "file_relation" drop constraint "file_relation_file_url_foreign";`);
    this.addSql(`alter table "file_relation" drop constraint "file_relation_user_id_foreign";`);
    this.addSql(`alter table "authorization_provider" drop constraint "authorization_provider_user_id_foreign";`);

    this.addSql(`drop table if exists "file" cascade;`);
    this.addSql(`drop table if exists "user" cascade;`);
    this.addSql(`drop table if exists "file_relation" cascade;`);
    this.addSql(`drop table if exists "authorization_provider" cascade;`);
  }

}
