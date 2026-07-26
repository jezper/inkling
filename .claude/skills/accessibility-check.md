# Skill: Accessibility Check

## When to use
After creating or modifying any UI component or page. This is never optional.

## Steps

1. Review all changed/new components for:

   **Labels and ARIA:**
   - Every interactive element has a descriptive label (visible or aria-label)
   - Form inputs have associated `<label>` elements
   - Buttons have descriptive text (not just icons)
   - Images have alt text (decorative images get `alt=""`)
   - Dynamic content changes announced via aria-live regions

   **Color:**
   - Status is conveyed with text AND color, never color alone
   - Check contrast ratios: 4.5:1 for normal text, 3:1 for large text
   - Verify both light and dark mode
   - UI components (borders, icons, focus rings): 3:1 minimum

   **Sizing:**
   - All text uses rem, not px
   - Touch targets are minimum 44x44px
   - Layout works at 200% zoom
   - Text remains readable at 200% font size

   **Keyboard:**
   - All interactive elements are focusable
   - Focus indicators are visible (2px solid ring minimum)
   - Tab order is logical (follows visual order)
   - No keyboard traps
   - Escape closes modals and popups
   - Enter/Space activate buttons and links

   **Motion:**
   - Animations wrapped in `prefers-reduced-motion` check
   - No auto-playing content
   - No flashing content (>3 flashes per second)

   **Semantic HTML:**
   - Page has one `<main>` element
   - Headings follow a logical hierarchy (h1 → h2 → h3, no skipping)
   - Lists use `<ul>`, `<ol>`, `<dl>` — not styled divs
   - Navigation in `<nav>` elements
   - Tables have `<th>` headers with scope attributes

2. Fix any violations found.

3. Run automated checks if available:
   ```bash
   npx eslint --rule '{"jsx-a11y/*": "error"}' src/
   ```

## Rules
- Never skip accessibility for "internal tools" — it's always required
- When in doubt, add the label/aria attribute — over-labelling is better than under-labelling
- Test with a screen reader at least once per major feature (VoiceOver on Mac, NVDA on Windows)
