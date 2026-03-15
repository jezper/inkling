# AGENTS.md — Agentöversikt & Ansvarskedja

15 agenter. Varje agent i .claude/agents/.
Alla agenter har förbättringsmandat — se CLAUDE.md §Förbättringsmandat.

## Ansvarskedja

```
STRATEGI        Product Manager → Legal Reviewer
DISCOVERY       Product Designer → UX Researcher → Data Analyst
DESIGN          UX Designer → UI Designer → Copywriter → Accessibility (pre)
IMPLEMENTATION  Frontend Builder, API & Backend, PII & Privacy, SEO Content
KVALITET        Accessibility (post), Test & QA, Growth Strategist
```

## Anropsordning vid ny feature
1. product-manager
2. product-designer
3. ux-researcher
4. ux-designer
5. ui-designer
6. copywriter
7. legal-reviewer
8. accessibility (pre)
9. data-analyst
10. frontend-builder
11. accessibility (post)
12. test-qa
13. growth-strategist

## Vetorätt
| Agent | Vetorätt |
|-------|----------|
| product-manager | Scope |
| legal-reviewer | All copy |
| product-designer | Visuell konsistens |
| accessibility | Deploy |
| test-qa | Deploy |
