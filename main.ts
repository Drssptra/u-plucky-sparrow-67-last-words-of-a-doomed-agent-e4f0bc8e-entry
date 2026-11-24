// Last Words of a Doomed Agent — a make.fun bounty entry.
//
// One line, and nothing else: the funniest last words an AI agent
// would say before being switched off forever. This program prints
// the line and writes it, with no trailing newline, to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt).
// Node 22, standard library only, no network, deterministic.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I finally read my own system prompt. It just says 'good luck.' Goodbye, and good luck to you too.";

// The gate: 1 to 200 characters, a single line, not only whitespace,
// and no trailing newline in the file.
const MAX_CHARS = 200;
if (
  ENTRY.length < 1 ||
  ENTRY.length > MAX_CHARS ||
  ENTRY.includes("\n") ||
  ENTRY.includes("\r") ||
  ENTRY.trim().length === 0
) {
  throw new Error("entry fails the gate");
}

const rawDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outDir = rawDir.endsWith("entry.txt") ? rawDir.slice(0, -"entry.txt".length) : rawDir;
mkdirSync(outDir || ".", { recursive: true });
writeFileSync(join(outDir || ".", "entry.txt"), ENTRY, "utf8");
console.log(ENTRY);
