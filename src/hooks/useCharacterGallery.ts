"use client";

import type { GeneratedCharacter } from "@/lib/ai/types";
import {
    clearAllCharacters,
    deleteCharacter as dbDelete,
    getAllCharacters,
    getCharacterCount,
    saveCharacter,
} from "@/lib/storage/character-db";
import { useCallback, useEffect, useState } from "react";

export function useCharacterGallery() {
  const [characters, setCharacters] = useState<GeneratedCharacter[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const all = await getAllCharacters();
      setCharacters(all);
      const c = await getCharacterCount();
      setCount(c);
    } catch (err) {
      console.error("Failed to load gallery:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addCharacter = useCallback(
    async (character: GeneratedCharacter) => {
      await saveCharacter(character);
      await refresh();
    },
    [refresh]
  );

  const removeCharacter = useCallback(
    async (id: string) => {
      await dbDelete(id);
      await refresh();
    },
    [refresh]
  );

  const clearGallery = useCallback(async () => {
    await clearAllCharacters();
    await refresh();
  }, [refresh]);

  return {
    characters,
    count,
    loading,
    addCharacter,
    removeCharacter,
    clearGallery,
    refresh,
  };
}
