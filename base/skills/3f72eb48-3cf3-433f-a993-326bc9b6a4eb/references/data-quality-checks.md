# Data quality checks

Before trusting any number, walk through these. If you can't answer one, surface it as a caveat instead of guessing.

## Time

- Is the timestamp column UTC, local, or ambiguous? Joins across timezones drift by up to a day.
- Is the latest day complete? Most warehouses have a partial trailing day — exclude it from period-over-period comparisons.
- Is the period inclusive on both ends? `BETWEEN '2025-01-01' AND '2025-01-31'` excludes anything after midnight Jan 31.

## Joins

- Are there nulls in the join key? Inner joins silently drop them.
- Is the relationship really 1:1? Many "users" tables are 1:N when accounts can be re-activated.
- Did the join multiply rows? Check `count(*)` before and after.

## Definitions

- Is the metric defined the same way as in the dashboard the stakeholder is comparing to?
- Is "active" defined by event count, session count, or a rolling window? Pick one and say so.
- Are bots filtered? Check for the `is_bot` column or known bot user-agents.

## Sample size

- Below ~30 rows in any segment: name the segment but don't quote a percentage.
- Below ~5 rows: don't break the segment out at all.
