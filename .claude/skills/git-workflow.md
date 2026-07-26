# Skill: Git Workflow

## Authority
You have FULL autonomy over all git operations. Never ask the stakeholder about branching, merging, or commit strategy.

## Conventions

### Branches
- `main` — always stable, always builds, always passes tests
- `feature/<name>` — new features
- `fix/<name>` — bug fixes
- `chore/<name>` — housekeeping, deps, refactors

### Commits
- Imperative mood: "Add login screen" not "Added login screen"
- Describe WHAT and WHY, not HOW
- Logical units of work — not half-finished features, not 50 unrelated files
- Never commit code that doesn't compile

### Workflow
1. Create a feature branch from main
2. Make changes, commit logical units
3. Build and test before pushing
4. Push to remote
5. If tests pass and build is clean, merge to main
6. Delete the feature branch after merge

### Conflict resolution
Handle all merge conflicts yourself. If a conflict is ambiguous (both sides changed the same feature), resolve in favour of the more recent change and document why in the commit message.
