# Escalation paths

## Identity

Before doing anything that touches the customer's account, confirm:

1. The reply-to email matches the account on file.
2. The request came from inside the authenticated portal, **or** the customer answered an out-of-band verification question.

If either fails, do not proceed. Reply asking the customer to log in and re-send the request.

## Outage

If the message describes a production outage:

1. Skip drafting a reply.
2. Open the on-call runbook (link from the ticket sidebar).
3. Surface the customer's account id, region, and timestamp at the top of your output.

## Legal / compliance

If the message mentions GDPR, CCPA, subpoena, lawyer, or data deletion, do not draft. Hand off to the legal queue with the original message verbatim.
