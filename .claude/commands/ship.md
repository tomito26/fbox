---
description: Commit all changes, push the branch, and open a PR upstream
argument-hint: [commit message / PR title]
allowed-tools: Bash(git status:*), Bash(git branch:*), Bash(git checkout:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(git log:*), Bash(git rev-parse:*), Bash(gh pr create:*), Bash(gh pr view:*), Bash(gh auth status:*), Bash(gh repo view:*)
---

Ship the current working changes: commit them, push the branch, and open a pull request
against the upstream default branch.

## Current state (auto-collected)
- Status: !`git status --short`
- Branch: !`git branch --show-current`
- Default branch: !`git rev-parse --abbrev-ref origin/HEAD 2>/dev/null | sed 's#origin/##' || echo master`
- Recent commits: !`git log --oneline -5`
- gh auth: !`gh auth status 2>&1 | head -2 || echo "gh NOT authenticated"`

## Steps

1. **Nothing to ship?** If the working tree is clean, nothing is staged, and the branch is
   not ahead of its upstream, stop and say there's nothing to ship.

2. **Never commit to the default branch.** If the current branch is the default branch
   (`master`/`main` above), create a feature branch first:
   `git checkout -b <short-kebab-name>` derived from the changes (or from "$ARGUMENTS").

3. **Commit:**
   - `git add -A`
   - Commit with a concise, conventional message. Use "$ARGUMENTS" as the subject if
     provided; otherwise write one summarizing the diff. End the message body with:
     `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

4. **Push:** `git push -u origin HEAD`.

5. **Open the PR** against the upstream default branch:
   - First confirm `gh` is authenticated (see "gh auth" above). If it is **not**, stop
     after the push and tell the user to run `gh auth login`, then print the compare URL
     `https://github.com/<owner>/<repo>/compare/<default>...<branch>?expand=1` as a
     fallback. Do not fail silently.
   - Otherwise: `gh pr create --base <default-branch> --fill` (use "$ARGUMENTS" as
     `--title` when provided, and pass a short `--body` summarizing the change plus a
     brief test plan). End the PR body with:
     `🤖 Generated with [Claude Code](https://claude.com/claude-code)`

6. **Report** the PR URL (from `gh pr view --json url --jq .url`, or the create output).

## Notes
- Confirm/adjust anything risky before force-pushing; prefer a normal `git push`.
- If a PR already exists for the branch, report its URL instead of creating a duplicate.
