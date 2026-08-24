# Agent entrypoint

## Use the global GPT VPS Runner

This repository uses the user's **single global GPT VPS Runner**.

Before claiming VPS access is unavailable, asking the user for shell commands, or searching for an old bridge, read the canonical protocol in `Laynito/contaneo`:

- `docs/GPT-VPS-RUNNER.md`
- `runner-manifest.json`
- mailbox: Issue #8 `[GPT VPS RUNNER] Control queue`

Canonical flow:

`ChatGPT/Codex -> GitHub mailbox -> GPT VPS Runner -> VPS -> GitHub result`

## Legacy mechanism is retired

Do **not** search for, recreate, or use:

- Hermes Autopilot daemon/bridge;
- `.hermes-autopilot.json`;
- `[HERMES AUTO]` Issues;
- `HERMES_JOB` envelopes;
- per-project daemons/runners;
- GitHub Actions/workflows/runners.

If `contrato` is not yet listed as a supported project in the global runner, treat that as a **runner registration/onboarding task**. Do not fall back to the retired daemon.

Use only actions explicitly exposed by the current runner manifest. Hermes/DeepSeek must not be assumed available through the mailbox unless the manifest explicitly enables them.
