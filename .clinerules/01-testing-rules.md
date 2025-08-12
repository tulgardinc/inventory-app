# Testing Rules (TDD & Commit Gate)

Authoritative policy for how testing is performed and enforced across workflows. Workflows reference this file rather than duplicating logic.

## Policy

1. Start with failing tests for every new feature or bug fix.
2. No commits unless the full test suite passes locally.
3. No PR creation unless the full test suite passes.
4. CI must pass before merge.

## Scope

* Applies to unit, integration, and end‑to‑end tests.
* Applies to all repositories and branches unless explicitly exempted below.

## Workflow Integration

* `start-issue.md`: begin by adding failing tests that encode acceptance criteria.
* `update-progress.md`: include test status in the TL;DR.
* `complete-issue-pr.md`: call `./scripts/ci-check.sh` and abort PR creation on failure.
* `wrapup.md`: verify CI remained green post‑merge.

## Exceptions

* Temporary exemptions require an issue comment titled "Testing Exemption" with rationale, scope, and expiry date, and must be approved by a maintainer. Workflows should refuse to proceed without that approval string.

## Signals & Reporting

* Progress updates mention tests added, passing, remaining red, and any flaky tests.

## Configuration

* Set `TEST_CMD` in the environment or a `.env.ci` loaded by workflows when auto‑detection isn’t suitable.
* Projects may add coverage gates by extending `scripts/ci-check.sh` or chaining a coverage script.
