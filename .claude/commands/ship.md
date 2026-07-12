---
description: Stage changes, generate a commit message, rebase onto remote, push, and open a PR upstream
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git commit:*), Bash(git fetch:*), Bash(git rebase:*), Bash(git push:*), Bash(git log:*), Bash(git branch:*), Bash(git checkout:*), Bash(git rev-parse:*), Bash(gh pr create:*), Bash(gh pr view:*), Bash(gh auth status:*)
argument-hint: [optional commit message / PR title]
---

# Git Ship Workflow (commit → rebase → push → PR)

## Step 1 — Check current status and branch (parallel)
Run both at the same time:
- `git status`
- `git branch --show-current`

Also note the default branch: `git rev-parse --abbrev-ref origin/HEAD` (strip the `origin/` prefix; fall back to `master`).

## Step 2 — Review what changed (parallel)
Run both at the same time:
- `git diff --cached`
- `git diff`

## Step 3 — Never commit to the default branch
If the current branch is the default branch (`master`/`main`), create a feature branch first so the changes can go through a PR:
`git checkout -b <short-kebab-name>` derived from the changes (or from $ARGUMENTS).
Otherwise stay on the current branch.

## Step 4 — Stage all changes
Run: git add .

## Step 5 — Write the commit message

If $ARGUMENTS is provided, use it as the commit message exactly as given.
If no $ARGUMENTS, analyze the staged changes and write a concise commit message following Conventional Commits format:

- `feat:` for new features
- `fix:` for bug fixes
- `chore:` for maintenance/config changes
- `refactor:` for code restructuring
- `docs:` for documentation changes
- `style:` for formatting changes
- `test:` for test additions or changes

The message should be: `<type>: <short description>` (max 72 chars)

## Step 6 — Commit
Run: git commit -m "<your message>"

## Step 7 — Fetch and rebase onto remote
Run: git fetch origin
Then, only if the remote branch already exists (`git rev-parse --verify origin/<current-branch-name>` succeeds): `git rebase origin/<current-branch-name>`
If the branch is brand new (no remote counterpart yet), skip the rebase.

If the rebase reports conflicts:
- List the conflicting files
- Stop and tell the user — do NOT attempt to resolve conflicts automatically
- Instruct them to resolve conflicts, run `git rebase --continue`, then run `/ship` again

If the rebase succeeds (or there was nothing to rebase), proceed.

## Step 8 — Push
Run: git push
If the push fails because the branch has no upstream, run:
git push --set-upstream origin <current-branch-name>

## Step 9 — Open a pull request upstream
Check `gh auth status`:
- If `gh` is **not** authenticated, stop after the push and tell the user to run `gh auth login`, then print the compare URL `https://github.com/<owner>/<repo>/compare/<default-branch>...<current-branch>?expand=1` as a fallback. Do not fail silently.
- If a PR already exists for the branch (`gh pr view --json url --jq .url`), report its URL instead of creating a duplicate.
- Otherwise create it against the default branch:
  `gh pr create --base <default-branch> --fill`
  Use $ARGUMENTS as `--title` when provided, and pass a short `--body` summarizing the change plus a brief test plan. End the PR body with:
  `🤖 Generated with [Claude Code](https://claude.com/claude-code)`

## Step 10 — Confirm
Report back:
- The commit message used
- Whether a rebase was needed (how many commits were replayed)
- The branch pushed to
- Whether the push succeeded
- The PR URL (or the `gh auth login` instruction + compare URL if gh wasn't authenticated)
