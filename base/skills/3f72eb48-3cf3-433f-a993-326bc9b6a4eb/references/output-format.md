# Output format

Every analysis response should have these three blocks, in this order. The headline is the only required one — the others are optional if there's nothing to add.

## 1. Headline (1 sentence)

The single most important takeaway. Quantified. Lead with the verb.

> Conversion fell 18% week-over-week, driven entirely by the new-user cohort.

## 2. Supporting metrics (≤ 4 bullets)

Each bullet: metric name, value, comparison baseline.

- New-user conversion: 3.1% (was 4.7% the prior week).
- Returning-user conversion: 6.4% (flat).
- New-user signups: 12,400 (up 6%).
- Drop concentrated in iOS Safari sessions.

## 3. Caveats (≤ 3 bullets)

What you'd want a careful reader to know before quoting these numbers.

- Last day of the range is partial; numbers above use the trailing 7 days excluding today.
- Source table joins on `user_id`, which is null for ~2% of rows; those are excluded.
- A/B test 412 was launched mid-range; cohort is contaminated past day 4.
