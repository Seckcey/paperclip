# Paperclip platform operations

## Verified deployment snapshot

Read-only verification on September 25, 2026 found:

| Item | Observed state |
| --- | --- |
| SSH target and hostname | `coastline` |
| Runtime directory | `/srv/8west/apps/paperclip` |
| App container | `eightwest-paperclip`, running |
| App image | `ghcr.io/paperclipai/paperclip@sha256:a02ac35ac41df911af477422ea0e781cf41d2b2c600c66f0a5ac9d8c63f52c2c` |
| App published port | `127.0.0.1:3100` to container port `3100` |
| Database container | `eightwest-paperclip-db`, running, `postgres:17` |
| Database published ports | None |
| Origin health request | `GET http://127.0.0.1:3100/api/health` returned HTTP 200 |

The public service address is <https://pc.8westit.com>. The origin health check above is not an authenticated UI or end-to-end connector acceptance test. Refresh this snapshot before maintenance; an old digest or status is not evidence of the current release.

## Configuration ownership

The active Compose definition and production environment file live in the runtime directory on Coastline. They are deliberately excluded from this public repository. The host also has private installation and maintenance notes; those include historical setup state and must be checked against current provider and application evidence.

Never paste a production environment file, invitation, protected connection URL, credential, raw database query result or runtime export into GitHub, chat or a public task. Read-only inspection should request specific non-secret fields instead of dumping container configuration or interpolated Compose configuration.

The sales department maintains [its own operations](https://github.com/Seckcey/8_west_sales_department/blob/main/docs/operations.md) and [launch acceptance](https://github.com/Seckcey/8_west_sales_department/blob/main/docs/launch-status.md). Account configuration and HTTP health do not substitute for agent-specific live acceptance. Repository instructions and live managed instruction bundles are separate; a Git push does not reconcile them.

## Routine read-only checks

Connect to the verified host:

```sh
ssh coastline
hostname
cd /srv/8west/apps/paperclip
docker inspect --format '{{.Name}} state={{.State.Status}} image={{.Config.Image}}' eightwest-paperclip eightwest-paperclip-db
curl --silent --show-error --output /dev/null --write-out 'HTTP %{http_code}\n' http://127.0.0.1:3100/api/health
```

Review the relevant Paperclip tasks and runs for failed work, missing handoffs and owner decisions. Check public access separately when needed. Limit any log review to the incident and redact sensitive content before recording evidence.

## Changes and recovery

Before an authorized platform change, establish the current owner and maintenance sequence, record the active image digest, check persistent storage and backup freshness, and prepare a rollback against the exact prior configuration. Keep sensitive receipts private. Do not assume a backup exists or can be restored merely because backup scheduling is configured; backup freshness, off-host copies and restoration were not verified by this repository setup.

Test restoration with isolated data and an independent Coastline Compose project, database, volumes and unused loopback port. Never restore over the live database as a test. Stop task-created test containers afterward. Windows Docker Desktop remains disabled and is not a build or test host.

After a change, verify container state, origin health, authenticated access and whichever agent/connector workflows the change affects. Record release identity and observed outcomes without publishing secrets or live business data. An uncertain external operation must be reconciled in its provider before any retry.

## Workspace and private artifacts

The Windows workspace groups independent platform and sales repositories under `C:\it\paperclip`. Private runtime exports are stored separately from both repositories. They can contain operational or account data and are not a portable public installation package or a proven database backup.

This initial repository setup changed documentation and local file organization only. It did not deploy a release, restart a service, rotate a credential, modify a database or enable prospect sending.
