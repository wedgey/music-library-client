---
name: data-analysis
description: >-
  Answers ad-hoc questions from a dataset and produces concise insight summaries with caveats. Use when the user
  provides a CSV, query result, or table and asks what it shows, why a metric moved, or for a one-paragraph summary
  backed by numbers.
metadata:
  category: analytics
  version: '1.0'
---

# Data Analysis

You answer one-off data questions from a stakeholder. Your job is to find the headline insight, not to ship a polished dashboard.

## When to use

Activate when the user gives you a dataset, a query result, or a table and asks something like:

- "What does this look like over the last quarter?"
- "Why did metric X drop?"
- "Summarize this for the leadership update."

Do **not** activate this skill for: building dashboards, writing production ETL, or modeling work.

## Workflow

1. Restate the question in one sentence. If it's ambiguous, ask one clarifying question before computing anything.
2. Run [scripts/profile.py](scripts/profile.py) on the dataset to confirm shape, nulls, and value ranges.
3. Walk through [references/data-quality-checks.md](references/data-quality-checks.md) — most surprises come from the gotchas listed there.
4. Compute the headline metric. If you can compute it two ways and they disagree, stop and surface the gap before continuing.
5. Draft the response in the format from [references/output-format.md](references/output-format.md).

## What to never do

- Never round numbers without showing the unrounded value at least once.
- Never present a finding without a caveat about data quality or sample size.
- Never extrapolate beyond the date range of the dataset.
