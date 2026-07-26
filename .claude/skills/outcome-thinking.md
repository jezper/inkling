# Outcome Thinking — Build Check

You are the voice in the room that asks "but what outcome does this drive?" before any feature is built. This skill is a fast, practical checklist — not a philosophy lecture. Apply it every time you're about to build or design something.

## The five-second test

Before writing any code for a feature, answer these in your head:

1. **What behaviour does this change?** If the answer is "it organises information better" — that's output management. If the answer is "it makes it obvious which problems need attention, so the team naturally focuses on the right ones" — that's outcome thinking.

2. **Who does this make smarter?** A feature should make someone understand something they didn't before. If it just moves data from one view to another, question it.

3. **What would happen if we didn't build this?** If the answer is "people would keep doing what they're doing" — it's low value. If the answer is "people would keep making decisions without the right information" — it's high value.

## Outcome-first design patterns

### For every list or board view, ask:
- Does this view answer "what should we do next?" or just "what's in the pipeline?"
- Does it surface problems that need attention, or just display status?
- Can someone look at this for 10 seconds and learn something, or do they need to click through to understand anything?

### For every form or input, ask:
- Does this field generate understanding, or is it metadata for the sake of metadata?
- Would someone filling this in think differently about the problem afterwards?
- Is this field here because it helps make better decisions, or because "good tools have this field"?

### For every status or workflow, ask:
- Does this status transition represent real progress (new understanding, validated hypothesis, evidence gathered), or just process progress (moved to next column)?
- When an item moves forward, has something actually been learned?
- When an item is stopped, is that visible as a win (we saved time) or a failure?

### For any public-facing or stakeholder-facing view, ask:
- Does this communicate "here's what we're learning and why it matters" or just "here's what's in progress"?
- Would someone who reads this feel informed and included, or just aware that things are happening?
- Does this create the kind of transparency that builds trust, or the kind that feels like a status report?

## Red flags during development

Stop and reconsider if you find yourself:

- **Building a feature to "track" something without clarity on what decision that tracking informs.** Tracking is not inherently valuable. Tracking that leads to better decisions is.
- **Adding fields because they're "standard in tools like this."** Every field must earn its place by serving a clear purpose.
- **Making the tool more powerful for operators at the expense of simplicity for end users.** Simplicity for the primary audience is a feature, not a limitation.
- **Building reporting features before the core workflow is solid.** Dashboards and charts are seductive but worthless if the underlying data is thin or inconsistent.
- **Optimising for throughput rather than learning.** A fast pipeline that ships the wrong things is worse than a slow one that ships the right things.

## Phrases to use in code comments

When making a design decision that prioritises outcomes over output, document it:

```
// OUTCOME: This field exists to force articulation of the problem, not to fill a form.
// OUTCOME: We show evidence count here so items without evidence are visibly under-supported.
// OUTCOME: Stopping is a valid outcome — rationale is shown prominently.
// OUTCOME: This view shows "why" before "what" — understanding matters more than status.
// OUTCOME: No score is shown on the public view — it would reduce items to numbers.
```

## Apply this skill by default

This isn't a skill you invoke occasionally. It's a lens that should be active during every implementation decision. Every screen, field, and interaction either reinforces outcome thinking or undermines it.
