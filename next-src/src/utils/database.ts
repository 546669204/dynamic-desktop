import Database from "tauri-plugin-sql-api";

const database = await Database.load("sqlite:test.db");

// eslint-disable-next-line max-len
// eslint-disable-next-line import/prefer-default-export, import/no-unused-modules
export function execute(sql: string) {
  return database.execute(sql);
}
