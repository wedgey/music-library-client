# Mobile verdict guide

Use this guide when you finish a mobile end-to-end run and need to decide whether the result is a product failure, an environment issue, or a flaky test.

## Verdict categories

| Category | Use when | Evidence to collect | What to say |
|---|---|---|---|
| **Pass** | The requested flow completed on the target platform and the expected UI or assertion outcome matched the request. | Final screen, passing assertions, and the platform/build used. | “Passed on iOS/Android with build X; the requested flow reached Y.” |
| **Product failure** | The app UI, state, or assertion failed in a way that matches the user’s bug or change. | First failing step, screenshot or screen recording if available, relevant log line, and the exact screen/state. | “Failed at step 3 during checkout; the app stayed on payment validation with error Z.” |
| **Environment issue** | The flow cannot complete because the simulator, emulator, device, credentials, or repo-defined setup is missing or broken. | Missing dependency, boot error, sign-in failure, device launch failure, or setup log. | “Blocked by Android emulator setup; the app never reached the login screen.” |
| **Flake / partial run** | The result changed across retries, the test timed out nondeterministically, or the run ended before the flow completed. | Failed attempt count, retry outcome, and the last stable step. | “Intermittent failure after onboarding; do not treat this as a confirmed product bug yet.” |

## Evidence checklist

When you report a result, include these items if they exist:

1. Platform: iOS or Android.
2. Build or target used.
3. Exact flow or bug reproduction point.
4. First failing step, if any.
5. Screenshot, screen recording, or log reference.
6. Whether the failure looks reproducible, flaky, or environment-related.

## How to separate product bugs from environment problems

Use the failure location to classify the issue:

- If the app launches, reaches the intended screen, and then shows the wrong behavior, treat it as a product failure.
- If the app never launches, the simulator/emulator is not ready, or required test data is missing, treat it as an environment issue.
- If one retry passes and another fails without a code change, treat it as flake until you have a stable reproduction.

## Reporting template

```markdown
Verdict: PASS / PRODUCT FAILURE / ENVIRONMENT ISSUE / FLAKE
Platform: iOS / Android
Target: simulator / emulator / device
Build: <build name or commit>
Flow: <requested journey>
First failure: <step and observable symptom, if any>
Evidence: <screenshot, log path, assertion name, or recording>
Next action: <what to debug next>
```

Keep the verdict short, but name the first observable failure precisely. That lets the next person reproduce the same break point instead of starting from the top of the flow.