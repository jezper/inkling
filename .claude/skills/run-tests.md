# Skill: Run Tests

## When to use
After making code changes, or when asked to test.

## Steps

1. Run the test suite:
   ```bash
   npm run test
   ```

2. If all tests pass, report success and stop.

3. If tests fail, for each failure:
   - Read what the test expected vs. what happened
   - Determine: is the bug in the implementation or the test?
   - If implementation is wrong → fix the implementation
   - If the test expectation is outdated due to an intentional change → update the test
   - If unclear, assume the implementation is wrong

4. Re-run. Repeat up to 3 cycles.

5. If still failing after 3 cycles, document the remaining failures and flag for review.

## Rules
- NEVER delete or skip failing tests to make the suite green
- NEVER mark tests as `.skip` or `.todo` to hide failures
- Fix the code, not the tests (unless the test expectation is genuinely wrong)
