# Harbor Point Holding — Full Stack Setup Guide
One sitting, four stations. Estimated total: ~90 minutes.

---

## Station 1 · GitHub (10 min)

You already cloned the repo. From this download, copy everything into that folder, then:

```bash
cd ~/HarborPointHolding
# (copy the unzipped contents here first — replace the old README when asked)
git add .
git commit -m "manifest: full Harbor Point system — 6 pages, docs, scripts, setup"
git push origin main
```

Verify at https://github.com/ACoolNerd/HarborPointHolding — you should see index.html, five hp-*.html files, docs/, scripts/, setup/, vercel.json.

**Codespaces note:** with the files pushed, GitHub → Code → Codespaces → "Create codespace on main" gives a full cloud editor. To preview the site inside a codespace: `python3 -m http.server 8080` then open the forwarded port.

---

## Station 2 · Vercel Deploy (10 min)

1. vercel.com → sign up/in **with the GitHub account (ACoolNerd)**
2. Add New… → Project → Import `HarborPointHolding`
3. Framework preset: **Other** · no build command · output dir: default → Deploy
4. You get a live preview URL immediately (e.g. harbor-point-holding.vercel.app) — test every page and quiz now

### Point the domain
5. Vercel project → Settings → Domains → add `harborpointholding.com` and `www.harborpointholding.com`
6. In GoDaddy → My Products → harborpointholding.com → DNS:
   - `A` record, name `@`, value `76.76.21.21`
   - `CNAME` record, name `www`, value `cname.vercel-dns.com`
   - Delete any conflicting `A`/`CNAME` records GoDaddy parked there
7. Wait 5–30 min. Vercel shows "Valid Configuration" and issues SSL automatically.

From then on: **every `git push` auto-deploys the live site.**

> Hosting decision: this makes GoDaddy Web Hosting Deluxe ($119.88) unnecessary. Cancel within the 30-day window (My Products → Web Hosting → Cancel → request refund), and cancel the Microsoft 365 email trial before it auto-bills if using Google Workspace instead.

---

## Station 3 · HubSpot (40 min)

### 3a — Portal
1. hubspot.com → create free account with hello@ email (or Gmail for now)
2. Settings ⚙ → Account Defaults → copy the **Hub ID** (this is `HUBSPOT_PORTAL_ID`)

### 3b — Custom properties
Settings → Properties → Contact properties → Create, one per row of `setup/hubspot-properties.csv`:
`lead_source_page`, `property_type`, `goal`, `timeline` (single-line text) and `deal_lane` (dropdown: Sell Fast / Lifeline / Commercial / Advisory / Landlord).

### 3c — The form
1. Marketing → Forms → Create → Embedded form → Blank
2. Add fields: First name, Email, Phone, City, and the five custom properties above
3. Publish → in the embed/share screen the URL contains the **Form GUID** (the long ID after the portal ID). Copy it.

### 3d — Wire the site
In **each of the 6 HTML files**, edit the config block at the top of `<body>`:

```js
HUBSPOT_PORTAL_ID: "12345678",        // your Hub ID
HUBSPOT_FORM_GUID: "abcd1234-....",   // your Form GUID
CALENDLY_URL: "https://calendly.com/kassandra-harborpoint/consultation",
```

`SOURCE_TAG` is preset per page — leave it. Commit + push → auto-deploys.

### 3e — Workflows (free tier = use form notifications; paid = full workflows)
Free tier minimum: Forms → your form → Options → "Send notification to" → Kassandra's email. 
If/when on Starter+: build the four workflows from README (Instant Alert, Hot Lead Flag, No-Booking Nudge, Stale Lead Sweep).

### 3f — Pipeline
Settings → Objects → Deals → Pipelines → rename stages to:
`New Lead → Contacted → Consultation Held → Offer/Proposal Out → Under Contract → Closed Won / Closed Lost`

### Test
Submit the quiz on the live site once per lane. Confirm each contact lands in HubSpot with the right `lead_source_page`.

---

## Station 4 · Calendly + Notion (30 min)

### Calendly (10 min)
1. calendly.com → sign up with the business email
2. One event type: **"Consultation — 30 min"**, phone/Zoom, buffer 15 min
3. Copy the link into every page's `CALENDLY_URL` → push

### Notion — Command Center (20 min)
Create a workspace **"Harbor Point Holding"** with this structure:

```
⚓ Harbor Point HQ                (top page)
├── 🎯 Deal Board                 (database — mirrors HubSpot stages)
│     Props: Name, Lane (select: the 5 lanes), Town, Stage,
│            Offer $, Source, Next Action, Next Action Date
│     Views: Board by Stage · Table by Lane · Calendar by Next Action
├── 📬 Outreach Tracker           (database)
│     Props: Owner/LLC, Property, Town, Touch # (1–6), Channel,
│            Last Touch Date, Response (select), Script Used
├── 🏛 Lis Pendens Pipeline       (database — the sourcing engine)
│     Props: Town, Filing Date, Owner, Address, Est. Equity,
│            Letter Sent (checkbox), Status
├── 📚 Scripts Library            (paste scripts/CRE-OUTREACH-SCRIPTS.md)
├── 🧭 Brand & Assets             (paste README brand table, link repo + live site)
└── 📈 Weekly Review              (template: leads by lane, booked calls,
                                   offers out, next week's mail drop)
```

Rule of thumb: **HubSpot = the machine** (automation, forms, alerts). **Notion = the cockpit** (deals, sourcing, scripts, weekly review). Don't duplicate contact records in both.

---

## Launch Checklist

- [ ] Files pushed to GitHub
- [ ] Vercel connected, preview tested
- [ ] DNS pointed, harborpointholding.com live with SSL
- [ ] GoDaddy hosting canceled/refunded (or consciously kept)
- [ ] M365 trial canceled (if going Workspace)
- [ ] HubSpot: Hub ID + Form GUID in all 6 pages
- [ ] Custom properties + pipeline created
- [ ] Form notification → Kassandra's email
- [ ] Calendly link live in all 6 pages
- [ ] One test lead per lane verified in HubSpot
- [ ] Notion HQ built
- [ ] First outreach batch scheduled

*0 → ∞*
