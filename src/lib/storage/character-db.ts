/**
 * IndexedDB storage for character gallery.
 * All data stays client-side — no server persistence.
 */

import type { GeneratedCharacter } from "@/lib/ai/types";
import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "thought-externalizer";
const DB_VERSION = 1;
const STORE_NAME = "characters";

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("by_date", "createdAt");
      }
    },
  });
}

export async function saveCharacter(
  character: GeneratedCharacter
): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, character);
}

export async function getAllCharacters(): Promise<GeneratedCharacter[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex(STORE_NAME, "by_date");
  return all.reverse(); // newest first
}

export async function getCharacter(
  id: string
): Promise<GeneratedCharacter | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

export async function deleteCharacter(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function clearAllCharacters(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}

export async function getCharacterCount(): Promise<number> {
  const db = await getDB();
  return db.count(STORE_NAME);
}
