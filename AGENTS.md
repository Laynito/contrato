# Agent entrypoint

## Use the global GPT VPS Runner

This repository uses the user's **single global GPT VPS Runner**.

Before claiming VPS access is unavailable, asking the user for shell commands, or searching for an old bridge, read the canonical protocol in `Laynito/contaneo`:

- `docs/GPT-VPS-RUNNER.md`
- `runner-manifest.json`
- mailbox: Issue #8 `[GPT VPS RUNNER] Control queue`

Canonical flow:

`ChatGPT/Codex -> GitHub mailbox -> GPT VPS Runner -> VPS -> GitHub result`

## Availability policy

- **The GPT VPS Runner is intended to work 24/7.** Do not postpone supported runner operations because of the time of day.
- DeepSeek is a separate cost-controlled resource. Do not invoke DeepSeek during the agreed peak windows in `America/Tijuana`:
  - Sunday through Thursday, `18:00-21:00`.
  - Sunday through Thursday, `23:00-03:00` crossing midnight.
- Outside those DeepSeek peak windows, DeepSeek may be used if needed and only when the runner explicitly exposes that capability.
- During a DeepSeek peak window, continue all work that does not require DeepSeek.

## Legacy mechanism is retired

Do **not** search for, recreate, or use:

- Hermes Autopilot daemon/bridge;
- `.hermes-autopilot.json`;
- `[HERMES AUTO]` Issues;
- `HERMES_JOB` envelopes;
- per-project daemons/runners;
- GitHub Actions/workflows/runners.

`contrato` is registered in the global runner manifest. If the VPS still rejects or does not process it, treat that as a global-runner implementation/configuration issue; do not fall back to the retired daemon.

Use only actions explicitly exposed by the current runner manifest. Hermes/DeepSeek must not be assumed available through the mailbox unless the manifest explicitly enables them.
