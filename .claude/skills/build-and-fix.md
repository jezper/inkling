# Skill: Build and Fix

## When to use
After making code changes, or when asked to build the project.

## Steps

1. Run the build:
   ```bash
   npm run build
   ```

2. If the build succeeds, report success and stop.

3. If the build fails, read the FULL error output carefully.

4. For each error:
   - Identify the root cause (don't just fix symptoms)
   - Fix the source code
   - If the error is a type mismatch, check the schema and regenerate types if needed (e.g., `npx prisma generate`)

5. Rebuild. If new errors appear, fix those too.

6. Repeat up to 5 cycles.

7. If still failing after 5 honest attempts:
   - Document what you've tried
   - Note the remaining errors clearly
   - Move on to other work
   - Flag it for review

## Rules
- NEVER delete or comment out code just to make the build pass
- NEVER ignore TypeScript errors with `// @ts-ignore` or `// @ts-expect-error`
- If an error requires stakeholder involvement (credentials, accounts, external services), note it clearly with step-by-step instructions and continue with everything else
