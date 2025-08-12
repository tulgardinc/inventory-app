# Issude driven workflow

## Conventions & Setup

**Repo & Branch**

* Default branch: `main` (set `DEFAULT_BRANCH` if different).
* Branch naming: `issue-<number>-<short-slug>`, where `<short-slug>` comes from the issue title.
* Always reference issues/PRs with canonical syntax in titles/bodies: `Closes #<number>`.

**Local Memory Bank (durable context)**

```
memory-bank/
  projectbrief.md        # goals, non-negotiables
  systemPatterns.md      # ADRs or stable architecture notes (link or embed)
  techContext.md         # stack/tooling, version pins, style guides
  activeContext.md       # current focus/plan/questions for the ACTIVE issue
  progress.md            # granular, private notes & experiment logs
```

**Labels**

* `status: in progress` → working
* `status: in review`   → PR opened
* `status: done`        → merged/closed
  (Adjust names in the commands if yours differ.)

**Environment Variables (agent sets or asks)**

* `REPO` (e.g., `org/name`) — optional; defaults to current git remote.
* `ISSUE` (number) — required when starting/updating/completing.
* `DEFAULT_BRANCH` (e.g., `main`).
* Optional: `REVIEWERS` (comma-separated), `TEAM_LABELS`, `AREA_LABELS`.

---

## Workflow A — Start work from an Issue

**Trigger:** `/start-issue`
**Inputs:** `ISSUE` (number or URL), optional `DEFAULT_BRANCH`

**Intent**

1. Validate issue exists & is open.
2. Create a scoped branch.
3. Initialize local memory from the issue.
4. Mark the issue as **in progress** and post a kickoff comment.

**Steps for Cline**

1. Read issue title/body & acceptance criteria. Draft a short plan (bullets).
2. Generate a short URL-safe slug from the title (≤ 5 words).
3. Create & checkout a branch.
4. Initialize/refresh `activeContext.md` + seed `progress.md`.
5. Add label `status: in progress` and post kickoff comment with plan & branch link.

**Shell (Cline runs these)**

```bash
# 0) Vars
ISSUE="${ISSUE:?issue required}"
DEFAULT_BRANCH="${DEFAULT_BRANCH:-main}"

# 1) Get issue data (json helpful for advanced flows; optional)
gh issue view "$ISSUE" --json number,title,body,url,state,labels,assignees > /tmp/issue.json

# 2) Make a short slug from the title (fallback to issue number)
TITLE=$(jq -r '.title' /tmp/issue.json 2>/dev/null || echo "")
RAW_SLUG="${TITLE:-issue-$ISSUE}"
SHORT_SLUG=$(printf "%s" "$RAW_SLUG" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g; s/-\{2,\}/-/g; s/^-//; s/-$//' | cut -d- -f1-5)
BRANCH="issue-${ISSUE}-${SHORT_SLUG}"

# 3) Create & checkout branch
git fetch origin "$DEFAULT_BRANCH" --quiet || true
git checkout -b "$BRANCH" "origin/$DEFAULT_BRANCH"

# 4) Ensure memory-bank exists
mkdir -p memory-bank

# 5) Seed activeContext.md (Cline writes the content before this command)
# (Cline generates content; then:)
# cat >/dev/null # (placeholder: Cline writes memory-bank/activeContext.md)

# 6) Touch progress log if absent
[ -f memory-bank/progress.md ] || echo "# Progress Log" > memory-bank/progress.md

# 7) Mark issue as in progress and add kickoff comment
gh issue edit "$ISSUE" --add-label "status: in progress"
gh issue comment "$ISSUE" --body "Starting work on branch \`$BRANCH\` 📦

**Plan (high-level):**
- (summary bullets here)

Link: \`$BRANCH\` pushes will appear on this PR once opened."
```

**Cline must also:**

* Write `memory-bank/activeContext.md` with:

  * `Issue #`, Title, URL
  * Scope & acceptance criteria (pulled from issue)
  * Assumptions/constraints
  * Plan of attack (bullets)
  * Open questions
* Append a timestamped entry to `memory-bank/progress.md`: “Kickoff: created branch `$BRANCH`.”

---

## Workflow B — Update progress on the Issue

**Trigger:** `/update-progress`
**Inputs:** `ISSUE`

**Intent**
Publish a concise public update while keeping rich notes local.

**Steps for Cline**

1. Read `memory-bank/activeContext.md` & `progress.md`.
2. Synthesize a compact TL;DR (≤ 6 bullets): **Done / Next / Blockers / Notes**.
3. If checklists exist in the issue body, update them (optional; keep minimal).
4. Keep long logs local; only post the summary publicly.

**Shell**

```bash
ISSUE="${ISSUE:?issue required}"

# 1) Cline writes a compact update to /tmp/issue-update.md
# 2) Post the update
gh issue comment "$ISSUE" --body-file /tmp/issue-update.md

# 3) Optionally add labels if a state change occurred
# gh issue edit "$ISSUE" --add-label "needs-review"   # example
```

**Comment template (Cline generates content):**

```
**Progress update** (YYYY-MM-DD):
- Done: …
- Next: …
- Blockers: …
- Notes: …
```

---

## Workflow C — Complete issue & open PR

**Trigger:** `/complete-issue-pr`
**Inputs:** `ISSUE`, optional `REVIEWERS`, `DEFAULT_BRANCH`

**Intent**
Run checks, push branch, open PR that **closes the issue**, move status to **in review**.

**Steps for Cline**

1. Ensure working tree clean; run tests/linters and fix if needed.
2. Push the branch.
3. Create PR with a clear title and body:

   * Summary of changes
   * Rationale & links
   * Testing notes
   * `Closes #<ISSUE>`
4. Apply labels and assign reviewers.

**Shell**

```bash
ISSUE="${ISSUE:?issue required}"
DEFAULT_BRANCH="${DEFAULT_BRANCH:-main}"
REVIEWERS="${REVIEWERS:-}"  # comma-separated GitHub handles

# 1) Derive current branch
BRANCH=$(git branch --show-current)

# 2) Quick checks (adjust to your stack)
git add -A
git diff --quiet || echo "Uncommitted changes present; committing."
git commit -m "WIP: prep PR for issue #$ISSUE" || true

# 3) Tests/linters (customize/extend)
# npm test || exit 1
# npm run lint || exit 1

# 4) Push branch
git push -u origin "$BRANCH"

# 5) Cline prepares PR title/body at /tmp/pr-title.txt and /tmp/pr-body.md (includes 'Closes #ISSUE')
# Example title fallback if not provided:
if [ ! -s /tmp/pr-title.txt ]; then echo "Resolve: #$ISSUE — <short description>" > /tmp/pr-title.txt; fi
if [ ! -s /tmp/pr-body.md ]; then echo "Closes #$ISSUE" > /tmp/pr-body.md; fi

# 6) Create PR
PR_URL=$(gh pr create \
  --base "$DEFAULT_BRANCH" \
  --head "$BRANCH" \
  --title "$(cat /tmp/pr-title.txt)" \
  --body-file /tmp/pr-body.md)

echo "PR created: $PR_URL"

# 7) Label & assign
gh pr edit "$PR_URL" --add-label "status: in review" || true
[ -n "$REVIEWERS" ] && gh pr edit "$PR_URL" --add-reviewer "$REVIEWERS" || true

# 8) Update the issue
gh issue comment "$ISSUE" --body "PR opened: $PR_URL
Moving to **in review**."
gh issue edit "$ISSUE" --add-label "status: in review" --remove-label "status: in progress" || true
```

**Cline must also:**

* Update `memory-bank/progress.md` with a brief “PR opened” entry.
* Snapshot the PR summary into `activeContext.md` for quick reference.

---

## Workflow D — Wrap-up after merge

**Trigger:** `/wrapup`
**Inputs:** `ISSUE`

**Intent**
Finalize public state, close loops in memory, and mark work done.

**Steps for Cline**

1. Find the PR that closes the issue (`gh pr list --search "Closes #ISSUE"` fallback: use linked PR).
2. If merged: ensure the issue is closed; label `status: done`; post final summary.
3. If not merged: leave a status comment with next steps.

**Shell**

```bash
ISSUE="${ISSUE:?issue required}"

# 1) Attempt to locate a merged PR referencing the issue
PR_URL=$(gh pr list --state all --search "Closes #$ISSUE in:title,body" --json url,mergedAt | jq -r '.[0].url // empty')

if [ -n "$PR_URL" ]; then
  MERGED_AT=$(gh pr view "$PR_URL" --json mergedAt -q '.mergedAt')
  if [ "$MERGED_AT" != "null" ] && [ -n "$MERGED_AT" ]; then
    # 2) Mark done
    gh issue close "$ISSUE" --comment "Merged via $PR_URL. Closing issue."
    gh issue edit "$ISSUE" --add-label "status: done" --remove-label "status: in review" || true
  else
    gh issue comment "$ISSUE" --body "PR pending: $PR_URL — not merged yet. Tracking remains in **in review**."
  fi
else
  gh issue comment "$ISSUE" --body "No PR found yet that closes this issue. Please run /complete-issue-pr when ready."
fi
```

**Cline must also:**

* Append a final “Outcome & Lessons” note to `memory-bank/progress.md`.
* If any architecture decisions were finalized, promote them into `systemPatterns.md` (or an ADR file in the repo) and link that ADR back on the issue or PR if helpful.

---

## Guidance for Cline (behavioral rules)

* **Always work from an Issue.** If the user asks for ad-hoc changes, create/locate an issue first.
* **Public vs Local:** Keep rich reasoning and logs in `memory-bank/`. Post only compact, useful status updates to the issue.
* **Small, meaningful updates:** Update the issue at milestones (completed checklist item, plan change, blocker).
* **Checklists:** If an issue has acceptance criteria, mirror them as a checklist in the body and tick them as they’re completed.
* **PR hygiene:** Title states intent; body explains *what/why/how tested*; include `Closes #…`.
* **Safety:** Never force-push to shared branches; only to the feature branch if absolutely necessary and after comment.
* **Idempotence:** Re-running a workflow should not corrupt state (detect branch exists, labels present, etc.).

---

## Optional: Projects & Releases (add later)

* **Projects (beta):** After creating the PR, add it to a GitHub Project and set status (requires org/project access).
* **Release notes:** On wrap-up, write a one-liner to a `CHANGELOG.md` pending section or a release note draft file.

---

## Quick Label Bootstrap (optional one-time)

```bash
for L in "status: in progress" "status: in review" "status: done"; do
  gh label create "$L" --description "$L" || true
done
```

---
