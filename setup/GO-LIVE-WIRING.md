# ⚓ GO-LIVE WIRING — Station 3 & 4
## HubSpot + Calendly → into the site → leads flowing
*Companion to wire-config.sh · ~45 minutes total · everything in order, nothing skipped*

---

## PART 1 — HubSpot Account (10 min)

1. Go to **hubspot.com → Get started free**
2. Sign up with the approved **Harbor Point operations email**. Do not use an individual's public identity for the neutral market account.
3. Company: Harbor Point Holding · Industry: Real Estate · Size: use the current operating team size
4. Skip all onboarding upsells → land on the dashboard

**Grab Value #1 — Portal ID:**
Click the **gear ⚙ (Settings)** top right → **Account Management → Account Defaults** → copy the **Hub ID** (a number like `48293716`).

---

## PART 2 — Custom Properties (10 min)

Settings ⚙ → **Data Management → Properties** → "Contact properties" → **Create property** — five times:

| # | Label | Internal name (auto) | Field type |
|---|---|---|---|
| 1 | Lead Source Page | `lead_source_page` | Single-line text |
| 2 | Property Type | `property_type` | Single-line text |
| 3 | Goal | `goal` | Single-line text |
| 4 | Timeline | `timeline` | Single-line text |
| 5 | Deal Lane | `deal_lane` | Dropdown select → options: Sell Fast, Lifeline, Commercial, Advisory, Landlord |

> Type the labels exactly as shown — HubSpot auto-generates the matching internal names. If it appends a suffix, edit the internal name to match the table.

---

## PART 3 — The Form (10 min)

1. **Marketing → Forms → Create form → Embedded form → Blank template**
2. Name it: **Harbor Point — Site Intake**
3. Drag in these fields: **First name · Email · Phone number · City · Lead Source Page · Property Type · Goal · Timeline**
4. **Options tab** → "Send submission email notifications to" → add the Harbor Point lead-operations email ← *this is the intake alert*
5. **Publish**

**Grab Value #2 — Form GUID:**
On the publish/share screen, the embed code contains `formId: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"` — that long ID is the GUID. Copy it.

---

## PART 4 — Calendly (5 min)

1. **calendly.com → Sign up** (Google sign-in with her Gmail is fine)
2. Create one event type: **"Consultation — 30 min"** · phone call or Google Meet · add 15-min buffer after
3. Availability: her real working windows
4. **Copy Link** — use an approved neutral Harbor Point booking URL

**Grab Value #3 — that link.**

---

## PART 5 — Wire the Site (5 min)

Put `wire-config.sh` (from Downloads) into the repo folder, then in Terminal — **one line, your three real values:**

```bash
cd ~/Documents/HarborPointHolding
mv ~/Downloads/wire-config.sh .
bash wire-config.sh PORTAL_ID FORM_GUID CALENDLY_URL
```

Real example shape:
```bash
bash wire-config.sh PORTAL_ID FORM_GUID https://calendly.com/YOUR_APPROVED_EVENT
```

It rewrites all six pages and confirms each one. Then:

```bash
git add -A && git commit -m "wire: HubSpot + Calendly live config" && git push origin main
```

---

## PART 6 — Re-upload to GoDaddy (5 min)

cPanel → File Manager → **public_html** → Upload → drag the same 6 files from `~/Documents/HarborPointHolding` (overwrite when asked):
`index.html · hp-sell-fast.html · hp-lifeline.html · hp-commercial.html · hp-advisory.html · hp-landlord.html`

---

## PART 7 — Test Every Lane (10 min)

On **harborpointholding.com**, run the quiz once per lane with test data (name "Test Lead", her real email):

- [ ] Hub (homepage quiz)
- [ ] Sell Fast
- [ ] Lifeline
- [ ] Commercial
- [ ] Advisory
- [ ] Landlord

For each: ✅ completion screen shows the brass **Book Direct** button → ✅ Calendly opens with her event → ✅ contact appears in HubSpot (**CRM → Contacts**) with the right **Lead Source Page** value → ✅ notification email hit her inbox.

Then delete the test contacts (Contacts → select → Delete).

---

## DONE MEANS

Every successful quiz creates or updates a HubSpot contact tagged with its source lane and alerts the Harbor Point lead queue. A Deal, referral, or licensed-practice handoff occurs only through the approved backend or supported automation. External outreach remains human-approved.

*0 → ∞*
