import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

// Run inside the candidate with its production TS loader. No provider or DB is used.
const serverRequire = createRequire("/app/server/package.json");
const claudeEntry = serverRequire.resolve("@paperclipai/adapter-claude-local/server");
const claudeRequire = createRequire(claudeEntry);
const engine = claudeRequire.resolve("@paperclipai/adapter-utils/acpx-engine/execute");
const constants = claudeRequire.resolve("@paperclipai/adapter-utils/acpx-engine/constants");
assert.equal(engine, "/app/packages/adapter-utils/src/acpx-engine/execute.ts");
assert.equal(constants, "/app/packages/adapter-utils/src/acpx-engine/constants.ts");
const sha256 = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
assert.equal(sha256(engine), "e177eb3310f194d14953cd4cf7d8cd94e0a9e0cee9a433768d42bdc68922b105");
assert.equal(sha256(constants), "3a7d651b2305745e29157e8e19b68d53e2877561cfe622c143affa993e4aade9");
const runtime = await import(pathToFileURL(engine).href);
const limits = await import(pathToFileURL(constants).href);
assert.equal(typeof runtime.createAcpxEngineExecutor, "function");
assert.equal(limits.ACPX_WAKE_ENV_MAX_BYTES, 16 * 1024);
console.log(JSON.stringify({ claudeEntry, engine, constants, engineSha256: sha256(engine), constantsSha256: sha256(constants), limitBytes: limits.ACPX_WAKE_ENV_MAX_BYTES, imported: true }, null, 2));
