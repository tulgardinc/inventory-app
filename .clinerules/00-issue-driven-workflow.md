# Issue-Driven Workflow Overview

This document is the **master reference** for your GitHub Issues–driven workflow in Cline. Each stage of the workflow is implemented in its own file under `.clinerules/workflows/` for direct triggering.

## Workflow Files

* **Start Issue:** [`start-issue.md`](./workflows/start-issue.md) — Create a branch from an issue, set it in progress, initialize local context.
* **Update Progress:** [`update-progress.md`](./workflows/update-progress.md) — Post public status updates to the issue while keeping detailed notes locally.
* **Complete Issue & Open PR:** [`complete-issue-pr.md`](./workflows/complete-issue-pr.md) — Push the branch, create a PR that references the issue, update status to in review.
* **Wrap-up After Merge:** [`wrapup.md`](./workflows/wrapup.md) — Confirm PR merged, close the issue, mark as done, finalize local notes.

## Labels

* `status: in progress` → Issue actively being worked on.
* `status: in review` → PR opened and awaiting review.
* `status: done` → Work merged and closed.

## Local Memory Bank

Use the memory bank rules to keep track of proejct context localy.

## Flow Summary

1. **/start-issue** → Initialize branch, context, labels, and kickoff comment.
2. **/update-progress** → Publish a short public update to the issue; sync local notes.
3. **/complete-issue-pr** → Push changes, open PR with `Closes #<issue>`, update labels.
4. **/wrapup** → Close out the issue post-merge, mark done, finalize notes.

## Guiding Principles

* **Public vs Local:** Public comments are concise; detailed reasoning stays in local memory.
* **Always from an Issue:** Every change starts from an issue.
* **Checkpoints:** Use logical checkpoints for posting updates to avoid noise.
* **PR Hygiene:** Titles, bodies, and labels clearly convey purpose and status.
* **Idempotence:** Workflows can be re-run safely without corrupting state.

Refer to the linked workflow files for exact commands and Cline steps for each phase.
