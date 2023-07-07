import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Notes {
  id: Generated<number>;
  title: string;
  body: string | null;
  user_id: number;
  created_at: Generated<Timestamp | null>;
  updated_at: Generated<Timestamp | null>;
}

export interface Users {
  id: Generated<number>;
  email: string;
  password: string | null;
  created_at: Generated<Timestamp | null>;
  updated_at: Generated<Timestamp | null>;
}

export interface Database {
  notes: Notes;
  users: Users;
}
