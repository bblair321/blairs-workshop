import type { Mod, ModCategory, ModVersion } from "@/generated/prisma/client";

export type ModWithVersions = Mod & {
  versions: ModVersion[];
};

export const CATEGORY_LABELS: Record<ModCategory, string> = {
  PC_GAME: "PC Game Mod",
  LUA: "FiveM Script",
  TOOLS: "Tool",
};

export const DEFAULT_INSTALL_INSTRUCTIONS: Record<ModCategory, string> = {
  PC_GAME: `1. Download the mod archive.
2. Extract the contents to your game's mod folder (see game-specific path in the description).
3. Enable the mod in your mod manager or follow the game's load order instructions.
4. Launch the game and verify the mod appears correctly.`,
  LUA: `1. Download the script archive and extract it.
2. Drop the resource folder into your server's "resources" directory.
3. Add "ensure <resource-name>" to your server.cfg.
4. Restart the server (or use "refresh" then "ensure") and check the server console for load errors.`,
  TOOLS: `1. Download the tool archive or installer.
2. Run the installer, or extract and run the executable from the folder.
3. If Windows SmartScreen warns about an unsigned app, click "More info" → "Run anyway" only if you trust this source.
4. See the mod description for what game or workflow this tool is meant for.`,
};
