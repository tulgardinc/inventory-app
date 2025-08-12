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

## Shell Commands

```bash
ISSUE="${ISSUE:?issue required}"
DEFAULT_BRANCH="${DEFAULT_BRANCH:-main}"
REVIEWERS="${REVIEWERS:-}"

# 1) Determine branch
BRANCH=$(git branch --show-current)

# 2) Stage and commit any pending changes
git add -A
git diff --quiet || git commit -m "Prep PR for issue #$ISSUE" || true

# 3) Run tests/linters (customize for your stack)
# npm test || exit 1
# npm run lint || exit 1

# 4) Push branch
git push -u origin "$BRANCH"

# 5) Prepare PR title/body files (Cline writes these before running)
if [ ! -s /tmp/pr-title.txt ]; then echo "Resolve: #$ISSUE — short description" > /tmp/pr-title.txt; fi
if [ ! -s /tmp/pr-body.md ]; then echo "Closes #$ISSUE" > /tmp/pr-body.md; fi

# 6) Create PR
PR_URL=$(gh pr create \
  --base "$DEFAULT_BRANCH" \
  --head "$BRANCH" \
  --title "$(cat /tmp/pr-title.txt)" \
  --body-file /tmp/pr-body.md)

echo "PR created: $PR_URL"

# 7) Apply labels and assign reviewers
gh pr edit "$PR_URL" --add-label "status: in review" || true
[ -n "$REVIEWERS" ] && gh pr edit "$PR_URL" --add-reviewer "$REVIEWERS" || true

# 8) Update the linked issue
gh issue comment "$ISSUE" --body "PR opened: $PR_URL\nMoving to **in review**."
gh issue edit "$ISSUE" --add-label "status: in review" --remove-label "status: in progress" || true
```

## Cline Must Also

* Update `memory-bank/progress.md` with a PR opened entry.
* Snapshot PR summary into `activeContext.md` for quick reference.
