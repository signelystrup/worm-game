// scripts/fix-drizzle-imports.mjs
import { readFile, writeFile } from "node:fs/promises";

const file = "./src/db/schema/relations.ts";

const content = await readFile(file, "utf8");

await writeFile(
  file,
  content.replace(
    /from ["']\.\/schema["']/g,
    'from "./schema.js"'
  )
);