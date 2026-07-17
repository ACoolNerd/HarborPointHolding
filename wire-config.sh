#!/bin/bash
# ============================================================
# Harbor Point Holding — wire-config.sh
# Injects HubSpot Portal ID, Form GUID, and Calendly URL
# into all six site pages in one shot.
#
# USAGE (from ~/Documents/HarborPointHolding):
#   bash wire-config.sh PORTAL_ID FORM_GUID CALENDLY_URL
#
# EXAMPLE:
#   bash wire-config.sh 12345678 abcd1234-ab12-cd34-ef56-abcdef123456 https://calendly.com/kassandra-hph/consultation
# ============================================================
 
set -e
 
PORTAL="$1"
GUID="$2"
CAL="$3"
 
if [ -z "$PORTAL" ] || [ -z "$GUID" ] || [ -z "$CAL" ]; then
  echo "Usage: bash wire-config.sh PORTAL_ID FORM_GUID CALENDLY_URL"
  echo "Get Portal ID:  HubSpot -> Settings (gear) -> Account Defaults -> Hub ID"
  echo "Get Form GUID:  HubSpot -> Marketing -> Forms -> your form -> Share/Embed (long ID after the portal ID)"
  echo "Calendly URL:   calendly.com -> your event -> Copy Link"
  exit 1
fi
 
FILES="index.html hp-sell-fast.html hp-lifeline.html hp-commercial.html hp-advisory.html hp-landlord.html"
 
for f in $FILES; do
  if [ ! -f "$f" ]; then echo "MISSING: $f — run this from ~/Documents/HarborPointHolding"; exit 1; fi
done
 
for f in $FILES; do
  # macOS sed requires -i ''
  sed -i '' "s|YOUR_PORTAL_ID|$PORTAL|g" "$f"
  sed -i '' "s|YOUR_FORM_GUID|$GUID|g" "$f"
  sed -i '' "s|https://calendly.com/YOUR_LINK/consultation|$CAL|g" "$f"
  echo "wired: $f"
done
 
echo ""
echo "All six pages wired."
echo "Verify one:  grep HUBSPOT_PORTAL_ID index.html"
echo ""
echo "Next: commit + push, then re-upload the 6 files to cPanel public_html:"
echo "  git add -A && git commit -m 'wire: HubSpot + Calendly live config' && git push origin main"
