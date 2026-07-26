# Skill: New View (Page)

## When to use
When creating any new page or major UI view.

## Checklist

1. **Route and placement.** Place in the correct directory for its audience and purpose.

2. **Auth guard.** Add role/permission check at the top of the page component if the page is restricted.

3. **Data fetching.** Use Server Components. Fetch data server-side. Apply role-based filtering if needed.

4. **Layout.**
   - Uses the design system spacing (4px base, multiples)
   - Card radius 12px, button radius 8px
   - Generous whitespace
   - Mobile-responsive (test at 320px, 640px, 1024px, 1440px)

5. **Typography.**
   - Uses rem for all text sizes
   - Follows the type scale defined in the design system
   - Headings use weight 600, body uses 400

6. **Accessibility.**
   - Page has a descriptive `<title>` (via metadata)
   - Main content wrapped in `<main>`
   - Headings in logical hierarchy (h1 → h2 → h3)
   - All interactive elements labelled
   - Focus indicators visible
   - Run accessibility-check skill

7. **Internationalisation.** (If multi-language)
   - All display strings from i18n files
   - Correct language for the audience

8. **Empty state.**
   - What does this page show when there's no data?
   - Must be helpful and guiding, not just "no data"
   - Include a clear call to action

9. **Loading state.**
   - Use skeleton screens, not spinners
   - Create a loading file in the route folder if supported by the framework

10. **Error state.**
    - What happens if data fetching fails?
    - Show a friendly error with recovery options

11. **Navigation.**
    - Add link in the appropriate sidebar/nav
    - Breadcrumbs if nested
    - Verify back button behavior

12. **Edge states.**
    - Very long titles or descriptions
    - Many items (100+) — is there pagination?
    - Missing optional fields
