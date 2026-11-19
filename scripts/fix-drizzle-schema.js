import fs from "node:fs";
import path from "node:path";

// find schema file
const schemaPath = path.resolve("drizzle/schema.ts");
if (!fs.existsSync(schemaPath)) {
    console.error("Drizzle schema file not found:", schemaPath);
    process.exit(1);
}

let content = fs.readFileSync(schemaPath, "utf8");

// Replace inet_server_port() with sql`inet_server_port()`
const regex = /(?<!sql`)\binet_server_port\(\)/g;
const updatedContent = content.replace(
    regex,
    "sql`inet_server_port()`"
);

// only write if there are changes
if (content !== updatedContent) {
    fs.writeFileSync(schemaPath, updatedContent, "utf8");
}
