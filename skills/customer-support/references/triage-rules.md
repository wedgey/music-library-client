# Triage rules

The first decision is always *who owns this ticket*. Use the keyword cues below; when two cues match, prefer the one higher in the table.

| If the message mentions… | Route to | Notes |
| --- | --- | --- |
| refund, chargeback, invoice, billing, plan change | Billing | Include the customer's plan name in the handoff. |
| API, integration, webhook, 4xx/5xx, error code | Engineering | Include the request id if visible. |
| login, MFA, password, SSO, account locked | Account | Verify identity before taking action — see [escalation.md](escalation.md#identity). |
| anything else | General support | Default lane. |

## Urgency overrides

Override the team routing and mark the ticket **urgent** when *any* of these hold:

- Customer is on an enterprise plan.
- Message contains "down", "outage", "can't access", or "production".
- The thread already has 3+ unanswered customer replies.

## Sentiment cues

If the customer uses profanity, all-caps, or threatens to churn, prepend an empathy line to the draft and flag the ticket for a human to send (do not auto-send).
