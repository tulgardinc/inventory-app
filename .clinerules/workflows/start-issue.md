# Workflow: Start Issue

**Trigger:** `/start-issue`
**Inputs:** `ISSUE` (number or URL), optional `DEFAULT_BRANCH`

## Intent

1. Validate issue exists & is open.
2. Create a scoped branch.
3. Initialize local memory from the issue.
4. Mark the issue as **in progress** and post a kickoff comment.

## Steps for Cline

1. Read issue title/body & acceptance criteria. Draft a short plan (bullets).
2. Generate a short URL-safe slug from the title (≤ 5 words).
3. Create & checkout a branch.
4. Initialize/refresh `activeContext.md` + seed `progress.md`.
5. Add label `status: in progress` and post kickoff comment with plan & branch link.

You have access to both `git` and `gh` commandline tools for this.

## Cline Must Also

* Write `memory-bank/activeContext.md` with:

  * `Issue #`, Title, URL
  * Scope & acceptance criteria
  * Assumptions/constraints
  * Plan of attack (bullets)
  * Open questions
* Append a timestamped entry to `memory-bank/progress.md`: “Kickoff: created branch `$BRANCH`.”
