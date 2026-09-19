import { ScannedContentType } from "../qr/detectType";
import db from "./schema";

export type ActionType = 'scanned' | 'generated';

export interface HistoryRecord {
  id: number;
  action_type: ActionType;
  source_type: string | null;
  content: string;
  image_uri: string | null;
  created_at: number;
}

export function insertHistory(
  actionType: ActionType,
  content: string,
  sourceType?: ScannedContentType | string,
  imageUri?: string
) {
  db.runSync(
    `INSERT INTO history (action_type, source_type, content, image_uri, created_at)
     VALUES (?, ?, ?, ?, ?);`,
    [actionType, sourceType ?? null, content, imageUri ?? null, Date.now()]
  );
}

export function getAllHistory(): HistoryRecord[] {
  return db.getAllSync<HistoryRecord>(
    `SELECT * FROM history ORDER BY created_at DESC;`
  );
}

export function getHistoryByType(actionType: ActionType): HistoryRecord[] {
  return db.getAllSync<HistoryRecord>(
    `SELECT * FROM history WHERE action_type = ? ORDER BY created_at DESC;`,
    [actionType]
  );
}

export function getHistoryById(id: number): HistoryRecord | null {
  const result = db.getFirstSync<HistoryRecord>(
    `SELECT * FROM history WHERE id = ?;`,
    [id]
  );
  return result ?? null;
}

export function deleteHistory(id: number) {
  db.runSync(`DELETE FROM history WHERE id = ?;`, [id]);
}

export function clearAllHistory() {
  db.runSync(`DELETE FROM history;`);
}