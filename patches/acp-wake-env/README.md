# Bounded ACP wake environment copy

Status: candidate tests passed and under review; production deployment pending.

An ACP wake with a 145,794-byte serialized context failed before its provider
turn with `spawn E2BIG`. The engine already delivers the authorized context in
its ACP prompt. This patch limits only the optional environment copy to 16 KiB
of UTF-8 JSON. It preserves the existing fresh-session history, checked resume
delta and source-trust boundaries. It does not truncate task history, alter
credentials, change permissions or modify legacy non-ACP adapters.

## Source and executable identity

- Upstream: `https://github.com/paperclipai/paperclip`
- Upstream revision: `d554c4789ed3930f8a53ac9fdf6503b3187097da`
- Local source commit represented by the patch: `bbd1ed5bee21a4fd1eccd1c6cc474679100ad2ad`
- Base and rollback image: `ghcr.io/paperclipai/paperclip@sha256:a02ac35ac41df911af477422ea0e781cf41d2b2c600c66f0a5ac9d8c63f52c2c`
- Candidate image ID: `sha256:542dc73eb7376cb89ca43c0c1276e0bebd0009ece797d3453a05b835d4c50d60`
- Candidate local tag: `8west-paperclip:acp-wake-bbd1ed5bee21`

The candidate inherits the production command:
`node --import ./server/node_modules/tsx/dist/loader.mjs server/dist/index.js`.
The server resolves the Claude adapter to its source entry. The Claude ACP
adapter dynamically imports `@paperclipai/adapter-utils/acpx-engine/execute`,
which resolves to `/app/packages/adapter-utils/src/acpx-engine/execute.ts`.
Thus the patched source is executable runtime code; stale `dist` copies are
not the loaded adapter entry. `verify-runtime.mjs` asserts this resolution,
imports the executor through the production loader, checks both file hashes,
and checks the 16,384-byte limit without credentials or a database.

| Runtime file | SHA-256 |
| --- | --- |
| `constants.ts` | `3a7d651b2305745e29157e8e19b68d53e2877561cfe622c143affa993e4aade9` |
| `execute.ts` | `e177eb3310f194d14953cd4cf7d8cd94e0a9e0cee9a433768d42bdc68922b105` |

## Reproduce on the approved test host

Use a separate task directory on Coastline. Do not use desktop Docker or mount
production state. The build applies the source patch in an intermediate stage,
checks the original and resulting source hashes, and copies only the two
runtime files into the final pinned image. Test and documentation changes in
the patch stay out of the final runtime image. No package download is required.

```sh
docker build --network none -t 8west-paperclip:acp-wake-bbd1ed5bee21 patches/acp-wake-env
docker run --rm --network none --memory=2g --cpus=2 --pids-limit=256 \
  --tmpfs /paperclip:rw,mode=700 \
  --mount type=bind,src="$PWD/patches/acp-wake-env/verify-runtime.mjs",dst=/verify-runtime.mjs,readonly \
  --entrypoint node 8west-paperclip:acp-wake-bbd1ed5bee21 \
  --import /app/server/node_modules/tsx/dist/loader.mjs /verify-runtime.mjs
```

Apply the patch to the pinned upstream checkout for its updated test file.
Run the candidate image with only that test file mounted over
`/app/packages/adapter-utils/src/acpx-engine/execute.test.ts`, then execute:

```sh
node_modules/.bin/vitest run packages/adapter-utils/src/acpx-engine/execute.test.ts \
  --maxWorkers 1 --no-file-parallelism
```

This exercises the runtime files inside the candidate image. The seven new
regressions cover exact byte boundaries, multibyte text, configured-value
override, a historical-size synthetic wake on local and remote ACP paths with
a successful real child spawn, preserved full history and trust labels, and a
retained-session delta. The provider runtime is mocked; live provider and
workflow acceptance remain post-release checks.

## Validation and limits

- Source test image: 185/185 ACP execution tests passed.
- Changed adapter: typecheck and build passed.
- Final candidate: production-loader resolution, import and file hashes passed.
- Final candidate ACP tests: **185/185 passed**, including all seven new cases.
- Full repository typecheck was attempted; the image lacks `cargo` required by
  the unrelated Rust runner. Full build was attempted with the correct command;
  it lacks `cc` required by the unrelated Tailscale native extension. Neither
  limitation is a change in this patch.
- The broad server test suite was started, then stopped to keep verification
  proportional to this ACP change. It did not produce a complete result and
  is not reported as passing. No unrelated failure was repaired.
- No production configuration, provider credential, task history, customer
  record, database, or backup is part of this patch or its tests.

## Release and rollback gate

The coordinator must review this exact patch and candidate before release.
Immediately before the app-only replacement, refresh task ownership, confirm
zero queued/running runs, inventory deferred wakes, check disk/RAM and the
verified backup receipt, and record the current image and schema version.
Use the existing private Compose configuration with an image-only override.
Do not copy private configuration into this repository. Replace only the app;
leave the database and persistent volumes intact. No migration is included.

Verify the running container image ID and runtime source hashes, public and
loopback health, unchanged schema, and no unexpected active runs. Review the
next task's prerequisite revisions before one authorized dependency wake.
Do not submit an additional manual wake for the same handoff. Keep sending and
paid actions disabled.

On a failed health, schema, runtime or controlled-wake check, hold downstream
work and restore the exact base digest using the same app-only override.
Verify health and image identity again. Preserve task/document revisions for
specific recovery; do not restore the database automatically or rerun an
uncertain external action. Remove task test containers after use.

The upstream license is retained in `UPSTREAM-LICENSE`.
