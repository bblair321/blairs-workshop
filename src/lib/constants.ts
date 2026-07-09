import type { Mod, ModCategory, ModVersion } from "@/generated/prisma/client";

export type ModWithVersions = Mod & {
  versions: ModVersion[];
};

export const CATEGORY_LABELS: Record<ModCategory, string> = {
  PC_GAME: "PC Game Mod",
  LUA: "Lua Script",
};

export const DEFAULT_INSTALL_INSTRUCTIONS: Record<ModCategory, string> = {
  PC_GAME: `1. Download the mod archive.
2. Extract the contents to your game's mod folder (see game-specific path in the description).
3. Enable the mod in your mod manager or follow the game's load order instructions.
4. Launch the game and verify the mod appears correctly.`,
  LUA: `1. Download the .lua file or package.
2. Copy it to your game's scripts folder (path varies by runtime).
3. Restart the game or reload scripts if your runtime supports hot reload.
4. Check the in-game console for any load errors.`,
};
