FROM ghcr.io/paperclipai/paperclip@sha256:a02ac35ac41df911af477422ea0e781cf41d2b2c600c66f0a5ac9d8c63f52c2c AS patched
WORKDIR /app
COPY 0001-fix-bound-optional-ACP-wake-environment-payload.patch /tmp/acp-wake.patch
RUN printf '%s\n' 'bafc66cd31eeccf714824267aee9f75563842a12c823cf60717c5397c7228a47  packages/adapter-utils/src/acpx-engine/execute.ts' | sha256sum -c - \
    && git apply --check /tmp/acp-wake.patch \
    && git apply /tmp/acp-wake.patch \
    && printf '%s\n' \
      '3a7d651b2305745e29157e8e19b68d53e2877561cfe622c143affa993e4aade9  packages/adapter-utils/src/acpx-engine/constants.ts' \
      'e177eb3310f194d14953cd4cf7d8cd94e0a9e0cee9a433768d42bdc68922b105  packages/adapter-utils/src/acpx-engine/execute.ts' | sha256sum -c -

FROM ghcr.io/paperclipai/paperclip@sha256:a02ac35ac41df911af477422ea0e781cf41d2b2c600c66f0a5ac9d8c63f52c2c
COPY --from=patched /app/packages/adapter-utils/src/acpx-engine/constants.ts /app/packages/adapter-utils/src/acpx-engine/constants.ts
COPY --from=patched /app/packages/adapter-utils/src/acpx-engine/execute.ts /app/packages/adapter-utils/src/acpx-engine/execute.ts
LABEL io.8west.paperclip.patch="bounded-acp-wake-env" \
      io.8west.paperclip.patch-revision="bbd1ed5bee21a4fd1eccd1c6cc474679100ad2ad" \
      io.8west.paperclip.upstream-revision="d554c4789ed3930f8a53ac9fdf6503b3187097da"
