#!/usr/bin/env sh
# Placeholder guard (brief §7): fails if any *indexed* page still contains
# placeholder copy. Pages that are noindex may carry placeholders while
# content is being written — they are excluded from the sitemap and from
# search until the copy lands (see content-manifest.md).
#
# Usage:
#   npm run guard:placeholders          # indexed pages only (deploy gate)
#   STRICT=1 npm run guard:placeholders # every page (pre-launch gate)
set -eu

fail=0
for f in $(find . -name '*.html' -not -path './node_modules/*'); do
    if grep -q 'PLACEHOLDER' "$f"; then
        if [ "${STRICT:-0}" = "1" ] || ! grep -q 'name="robots" content="noindex' "$f"; then
            echo "PLACEHOLDER found in indexed page: $f"
            fail=1
        fi
    fi
done

if [ "$fail" = "1" ]; then
    echo "guard:placeholders FAILED — placeholder copy must not ship on indexed pages"
    exit 1
fi
echo "guard:placeholders OK"
