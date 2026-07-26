# Skill: Add Feature

## When to use
When implementing a new feature end-to-end.

## Steps

1. **Understand the feature.** Read the PRD or requirements. If behaviour is ambiguous, ask the stakeholder in plain language (product/UX terms, not engineering).

2. **Apply outcome thinking.** Before building, answer: What outcome does this serve? What behaviour does it change? What would happen if we didn't build this? (See outcome-thinking skill.)

3. **Data model.** Does this feature need schema changes?
   - If yes: update the schema (e.g., `prisma/schema.prisma`)
   - Run migrations
   - Update TypeScript types

4. **API route.** Does this feature need a new endpoint?
   - Create/modify the API route
   - Add auth check
   - Validate input (use schema validation)
   - Handle errors with descriptive messages

5. **Server Component.** Create the page or section as a Server Component.
   - Fetch data server-side
   - Apply role-based visibility filtering if needed
   - Place in the correct directory for its audience

6. **Client Components.** Only for interactive parts:
   - Forms, state management, event handlers
   - Keep as small and focused as possible
   - Place in `components/`

7. **Internationalisation.** (If multi-language)
   - Add all user-facing strings to the relevant i18n files
   - Never hardcode display strings in components

8. **Accessibility check.** Run the accessibility-check skill on all new/changed UI.

9. **Tests.**
   - Unit test any new business logic
   - Integration test any new API route
   - E2E test if this is a critical user flow
   - Verify keyboard navigation works

10. **Build.** Run the build-and-fix skill.

11. **Commit.** Logical commit with descriptive message following git-workflow conventions.
