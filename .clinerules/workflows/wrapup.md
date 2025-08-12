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

## Shell Commands

```bash
ISSUE="${ISSUE:?issue required}"

# 1) Locate PR referencing the issue
PR_URL=$(gh pr list --state all --search "Closes #$ISSUE in:title,body" --json url,mergedAt | jq -r '.[0].url // empty')

if [ -n "$PR_URL" ]; then
  MERGED_AT=$(gh pr view "$PR_URL" --json mergedAt -q '.mergedAt')
  if [ "$MERGED_AT" != "null" ] && [ -n "$MERGED_AT" ]; then
    # 2) Close the issue and update labels
    gh issue close "$ISSUE" --comment "Merged via $PR_URL. Closing issue."
    gh issue edit "$ISSUE" --add-label "status: done" --remove-label "status: in review" || true
  else
    gh issue comment "$ISSUE" --body "PR pending: $PR_URL — not merged yet. Tracking remains in **in review**."
  fi
else
  gh issue comment "$ISSUE" --body "No PR found yet that closes this issue. Please run /complete-issue-pr when ready."
fi
```

## Cline Must Also

* Append a final “Outcome & Lessons” entry to `memory-bank/progress.md`.
* Update `activeContext.md` to reflect the task is complete.
* If relevant, promote any architecture decisions or patterns from the work into `systemPatterns.md` or ADR files.
