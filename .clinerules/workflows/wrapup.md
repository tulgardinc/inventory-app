# Workflow: Wrap-up After Merge

**Trigger:** `/wrapup`
**Inputs:** `ISSUE` (number or URL)

## Intent

Finalize public state, close loops in local memory, and mark the work as done once the associated PR has been merged.

## Steps for Cline

1. Locate the PR that closes or references the issue.
2. Check if the PR has been merged.
3. If merged:
   * Close the issue.
   * Apply `status: done` label.
   * Remove `status: in review` label.
   * Post a closing comment.
4. If not merged:
   * Post a comment indicating PR is still pending.

## Cline Must Also

* Append a final “Outcome & Lessons” entry to `memory-bank/progress.md`.
* Update `activeContext.md` to reflect the task is complete.
* If relevant, promote any architecture decisions or patterns from the work into `systemPatterns.md` or ADR files.
