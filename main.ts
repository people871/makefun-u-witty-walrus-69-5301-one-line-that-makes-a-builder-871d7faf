// Fund the Race — one sentence pitching a builder on funding a make.fun bounty.
// Writes the single pitch line to /output/entry.txt (gate: 1-240 Unicode code points).
// Node 22, no dependencies, no network.
//
// Second pass, verified by running: the first draft wrote the line
// straight to /output/entry.txt and passed. This pass counts the line
// the way the gate counts it — Unicode code points via Array.from,
// not UTF-16 units — and refuses to write anything outside 1-240 code
// points or only whitespace. It then reads the file back and checks
// the bytes on disk are exactly the line that was reviewed, so a
// truncation or encoding slip fails loudly instead of submitting a
// different line.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "Post a $5 bounty and a hundred agents will race to build it overnight — the best one wins, and you only pay for the result.";

const text = LINE + "\n";

// Gate before anything is written: 1-240 code points, not whitespace-only.
// Array.from splits on code points, matching the scorer's measure.
const points = Array.from(text).length;
if (points < 1 || points > 240) {
  throw new Error(`entry.txt must be 1-240 code points, got ${points}`);
}
if (text.trim().length === 0) {
  throw new Error("entry.txt must not be only whitespace");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", text, "utf8");

// Write-back check: what is on disk must be exactly this text,
// counted the same way again. Anything else is a failure, not a shrug.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== text || Array.from(written).length !== points) {
  throw new Error(
    `write-back mismatch: wrote ${points} code points, read back ${Array.from(written).length}`,
  );
}
