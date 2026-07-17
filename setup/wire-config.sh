#!/bin/bash
# Harbor Point Holding — neutral configuration updater
# Usage: bash setup/wire-config.sh PORTAL_ID FORM_GUID [APPROVED_CALENDLY_URL]

set -euo pipefail

PORTAL="${1:-}"
GUID="${2:-}"
CAL="${3:-}"

if [ -z "$PORTAL" ] || [ -z "$GUID" ]; then
  echo "Usage: bash setup/wire-config.sh PORTAL_ID FORM_GUID [APPROVED_CALENDLY_URL]"
  exit 1
fi

case "$PORTAL" in (*[!0-9]*|'') echo "Portal ID must contain digits only"; exit 1;; esac
case "$GUID" in
  ????????-????-????-????-????????????) ;;
  *) echo "Form GUID must use the standard UUID format"; exit 1;;
esac
if [ -n "$CAL" ] && [[ "$CAL" != https://calendly.com/* ]]; then
  echo "Booking URL must be blank or an approved https://calendly.com/ URL"
  exit 1
fi

FILES=(index.html hp-sell-fast.html hp-lifeline.html hp-commercial.html hp-advisory.html hp-landlord.html)
for f in "${FILES[@]}"; do
  test -f "$f" || { echo "Missing: $f"; exit 1; }
  PORTAL="$PORTAL" GUID="$GUID" CAL="$CAL" perl -0pi -e '
    s/HUBSPOT_PORTAL_ID: "[^"]*"/HUBSPOT_PORTAL_ID: "$ENV{PORTAL}"/g;
    s/HUBSPOT_FORM_GUID: "[^"]*"/HUBSPOT_FORM_GUID: "$ENV{GUID}"/g;
    s/CALENDLY_URL: "[^"]*"/CALENDLY_URL: "$ENV{CAL}"/g;
  ' "$f"
  echo "wired: $f"
done

node scripts/validate-site.mjs
echo "Configuration updated and validated. Commit only after all six live tests pass."
