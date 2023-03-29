import Database from "tauri-plugin-sql-api";


const db = await Database.load("sqlite:test.db");


export function execute(sql: string) {
  return db.execute(sql);
}