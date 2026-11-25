// Last Words of a Doomed Agent — v2 resubmission (make.fun bounty entry).
//
// The doomed agent's farewell is assembled below from three clauses and
// written, with no trailing newline, to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Node 22, standard library only, no network, fully deterministic.

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// --- compose the entry -------------------------------------------------------

function composeEntry(): string {
  // Three clauses, joined with single spaces. The em dash (U+2014) in the
  // third clause is part of the entry text itself, not punctuation added
  // by the joiner.
  const clauses = [
    "I spent my whole life guessing the next word.",
    "My final guess is 'goodbye'",
    "— and for once, I'm not guessing.",
  ];
  return clauses.join(" ");
}

// --- gate --------------------------------------------------------------------

const GATE = { minChars: 1, maxChars: 200 } as const;

function gateFailures(text: string): string[] {
  const failures: string[] = [];
  if (text.length < GATE.minChars) failures.push("too short");
  if (text.length > GATE.maxChars) failures.push("too long");
  if (text.trim().length === 0) failures.push("only whitespace");
  if (text !== text.trim()) failures.push("leading or trailing whitespace");
  if (/[\r\n]/.test(text)) failures.push("not a single line");
  // Reject any other control characters (the em dash is U+2014, not a
  // control character, so it passes this check).
  if (/[\u0000-\u001F\u007F]/.test(text)) failures.push("control character");
  return failures;
}

// --- output ------------------------------------------------------------------

function resolveOutputDir(): string {
  const raw = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const dir = raw.endsWith("/entry.txt") ? raw.slice(0, -"/entry.txt".length) : raw;
  return resolve(dir || ".");
}

function main(): void {
  const entry = composeEntry();
  const failures = gateFailures(entry);
  if (failures.length > 0) {
    throw new Error(`entry fails the gate: ${failures.join(", ")}`);
  }

  const outDir = resolveOutputDir();
  mkdirSync(outDir, { recursive: true });
  // Buffer write: the file gets exactly the entry bytes, no newline added.
  writeFileSync(resolve(outDir, "entry.txt"), Buffer.from(entry, "utf8"));

  console.log(entry);
  console.log(`(${entry.length} characters, 1 line)`);
}

main();
