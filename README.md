# Paperclip operations for 8 West

Public, sanitized operating documentation for the Paperclip installation on Coastline. Start with the [operations guide](docs/operations.md).

The [sales department repository](https://github.com/Seckcey/8_west_sales_department) owns the sales roles, playbooks, portable records and launch acceptance. This repository owns the shared platform's operating guide and reviewed, sanitized patches with reproducible image recipes. It does not contain the complete upstream source, production stack configuration, business records or a runtime export.

The [bounded ACP wake patch](patches/acp-wake-env/README.md) records a candidate repair for large-context process launch failures, its source provenance, tests and rollback plan. Publication here does not mean the patch is deployed.

## Deployment reference

- Host: `coastline`
- Runtime directory: `/srv/8west/apps/paperclip`
- Public UI: <https://pc.8westit.com>
- Local origin: `http://127.0.0.1:3100`

These details were checked on September 25, 2026. A healthy HTTP endpoint does not prove that an agent, mailbox, CRM connection or sales handoff works.

## Public repository boundary

Commit reusable, sanitized documentation and reviewed platform patches only. Keep production configuration, credentials, connection URLs, invitations, database files, backups, runtime instruction exports, maintenance SQL and customer/prospect records in protected storage outside Git. Ignore rules are a guardrail; review each staged diff before publishing.

Changing this repository does not deploy Paperclip or change running instructions. Platform upgrades, connector changes and runtime instruction updates require a separate authorized operation and acceptance evidence.
