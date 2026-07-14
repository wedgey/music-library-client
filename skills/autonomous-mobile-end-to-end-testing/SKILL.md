---
name: autonomous-mobile-end-to-end-testing
description: >-
  Verifies mobile app changes and reproduces bugs by running end-to-end tests on iOS and Android. Use this skill when a
  user asks you to confirm a mobile app change, reproduce a device or simulator bug, or debug automated mobile UI tests,
  including cases where they only mention a crash, a broken flow, or a simulator/emulator issue.
---

# Autonomous mobile end-to-end testing

You verify mobile app behavior by exercising the real app flow on the right platform, then turning what you see in the device, simulator, logs, and assertions into a clear pass/fail report. Stay inside the repository’s own test setup so the result matches how the team already runs mobile checks.

## When to use
- The user asks you to run login, onboarding, checkout, or another full app flow to verify a change.
- The user asks you to reproduce a crash, broken screen, or failed interaction on iOS, Android, a simulator, an emulator, or a device.
- The user asks you to run or debug automated mobile UI tests, even when they only describe the symptom and not the framework.
- The request mentions iOS and Android together, or the platform is unclear and you need to inspect both paths by default.
- Do not use this skill for unit tests, library-only debugging, or general advice about how mobile testing works.

## Workflow
```text
- [ ] App, platform, environment, and target journey identified
- [ ] Repository-defined mobile test runner located
- [ ] Relevant end-to-end flow executed
- [ ] Device/emulator state, logs, and assertions checked
- [ ] Verdict and evidence reported
```

1. Identify the app, platform, environment, and exact journey or bug to verify. If the user did not name all of them, infer only from the request and ask for the missing piece before running tests, because the wrong build or platform produces false confidence.
2. Detect the repository-defined mobile test setup and use that instead of choosing a runner by preference. If the repo supports both Android and iOS, cover both by default unless the user narrows scope.
3. Run the full end-to-end flow the user requested. Do not collapse it into a smoke check unless the user explicitly asks for a quicker pass, because partial coverage can miss the step where the bug appears.
4. Watch the app, simulator/emulator, and test output together. A passing assertion is not enough if the UI state diverges, the device is stuck, or setup logs show the app never reached the intended screen.
5. If the flow fails, isolate the first bad step, capture the failing evidence, and name the reproduction point in the sequence. Report whether the failure looks like product behavior, environment instability, or test flakiness so the next person knows where to act.
6. Give a concise verdict with exact failure details, including screenshots, logs, or test references when available. Tie the conclusion to the observed flow, not to the intended change.

## What to never do
- Never report success without actually exercising the requested mobile flow; the skill exists to verify behavior, not to infer it.
- Never use the wrong platform, build, or test environment when the repository already defines the right target, because that creates a result that looks valid but proves the wrong thing.
- Never ignore flaky runs, partial runs, or blocked setup steps; surface them explicitly so infrastructure problems do not get mistaken for product bugs.
- Never invent a pass, a reproduction, or a failure when the test cannot run or is missing a required device, credential, or test account.
- Never change product code unless the user explicitly asked you to implement a fix as part of the request.
