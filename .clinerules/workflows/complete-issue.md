# Workflow: Complete Issue & Open PR

**Trigger:** `/complete-issue-pr`
**Inputs:** `ISSUE` (number or URL), optional `REVIEWERS`, `DEFAULT_BRANCH`

## Intent

Prepare the work for review by pushing the feature branch, opening a pull request that references the issue, and updating the issue’s status.

## Steps for Cline

1. Verify working tree is clean.
2. Run tests and linters.
3. Push the current branch.
4. Create a pull request referencing the issue (`Closes #<ISSUE>` in body).
5. Assign reviewers and apply labels.
6. Update the issue with a PR link and move to **in review** status.

## Cline Must Also

* Update `memory-bank/progress.md` with a PR opened entry.
* Snapshot PR summary into `activeContext.md` for quick reference.
