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

## Shell Commands

```bash
# 0) Vars
ISSUE="${ISSUE:?issue required}"
DEFAULT_BRANCH="${DEFAULT_BRANCH:-main}"

# 1) Get issue data
gh issue view "$ISSUE" --json number,title,body,url,state,labels,assignees > /tmp/issue.json

# 2) Create slug
TITLE=$(jq -r '.title' /tmp/issue.json 2>/dev/null || echo "")
RAW_SLUG="${TITLE:-issue-$ISSUE}"
SHORT_SLUG=$(printf "%s" "$RAW_SLUG" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g; s/-\{2,\}/-/g; s/^-//; s/-$//' | cut -d- -f1-5)
BRANCH="issue-${ISSUE}-${SHORT_SLUG}"

# 3) Create & checkout branch
git fetch origin "$DEFAULT_BRANCH" --quiet || true
git checkout -b "$BRANCH" "origin/$DEFAULT_BRANCH"

# 4) Ensure memory-bank exists
mkdir -p memory-bank

# 5) Touch progress log if absent
[ -f memory-bank/progress.md ] || echo "# Progress Log" > memory-bank/progress.md

# 6) Mark issue as in progress and add kickoff comment
gh issue edit "$ISSUE" --add-label "status: in progress"
gh issue comment "$ISSUE" --body "Starting work on branch \`$BRANCH\` 📦\n\n**Plan (high-level):**\n- (summary bullets here)\n\nLink: \`$BRANCH\` pushes will appear on this PR once opened."
```

## Cline Must Also

* Write `memory-bank/activeContext.md` with:

  * `Issue #`, Title, URL
  * Scope & acceptance criteria
  * Assumptions/constraints
  * Plan of attack (bullets)
  * Open questions
* Append a timestamped entry to `memory-bank/progress.md`: “Kickoff: created branch `$BRANCH`.”
