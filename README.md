# ⚓ Harbor Point Holding

**Connecticut Real Estate — Acquisition & Advisory**
*Every Property Finds Its Harbor.*

Live domain: [harborpointholding.com](https://harborpointholding.com) · Registered 7/17/2026 · Operating model: neutral Connecticut property market and intelligence platform

---

## What This Is

A lead-generation and property-intelligence system for the Connecticut market: one hub site plus five lane-specific landing pages. Harbor Point remains person-neutral. Qualified matters may be routed to acquisition, commercial, professional-referral, or separately governed licensed-practice lanes after review and consent.

Static HTML. No build step. No CMS. No dependencies to break.

---

## Brand System

| Token | Value | Use |
|---|---|---|
| Harbor Ink | `#0B1E24` | Background |
| Panel Water | `#12303A` | Cards, intake shell |
| Beacon Brass | `#C4913C` | Accent, CTAs, logo |
| Brass Highlight | `#E0B266` | Hover states |
| Fog White | `#E9EFEA` | Primary text |
| Tide Teal | `#6FA3A8` | Secondary text, chart grid |

**Type:** [Marcellus](https://fonts.google.com/specimen/Marcellus) (display) · [Public Sans](https://fonts.google.com/specimen/Public+Sans) (body)
**Signature elements:** harbor-chart grid lines, coordinates eyebrow, compass-rose mark, pulsing beacon on every intake.

---

## Architecture

```
/
├── index.html    # Hub — routes to all 5 lanes, own intake
├── hp-sell-fast.html         # Lane N  — Residential 24hr cash offers
├── hp-lifeline.html          # Lane NE — Pre-foreclosure, confidential options
├── hp-commercial.html        # Lane E  — CRE dispositions, principal-to-principal
├── hp-advisory.html          # Lane SE — Redevelopment, zoning, permitting
├── hp-landlord.html          # Lane S  — Tired-landlord dual path (fix or exit)
├── docs/
│   ├── harborpoint-system-blueprint.html   # Tech/marketing/CRM architecture
│   └── harborpoint-launch-cost.png         # Year-one cost card
├── privacy.html              # Privacy policy (required for ads platforms)
├── terms.html                # Terms of use
├── 404.html                  # Off-the-chart page
├── favicon.svg               # Compass mark
├── robots.txt / sitemap.xml  # SEO baseline
├── 00_HARBORPOINT_MASTER.md  # Master prompt — system brain
├── scripts/
│   └── CRE-OUTREACH-SCRIPTS.md             # Commercial lane outreach library
└── setup/
    ├── SETUP-GUIDE.md / GO-LIVE-WIRING.md  # Launch playbooks
    ├── wire-config.sh                      # One-command HubSpot/Calendly injection
    └── hubspot-properties.csv
```

### Source Tags (attribution backbone)

| Page | `SOURCE_TAG` |
|---|---|
| Hub | `harborpoint-hub` |
| Sell Fast | `harborpoint-sellfast` |
| Lifeline | `harborpoint-lifeline` |
| Commercial | `harborpoint-commercial` |
| Advisory | `harborpoint-advisory` |
| Landlord | `harborpoint-landlord` |

Every intake submission carries its tag into HubSpot (`lead_source_page`), so every marketing dollar is attributable per lane.

---

## Configuration

Each page has one config block at the top of `<body>`. Three values wire the whole fleet:

```js
const HP_CONFIG = {
  SOURCE_TAG: "harborpoint-hub",          // preset per page — do not change
  HUBSPOT_PORTAL_ID: "YOUR_PORTAL_ID",    // HubSpot → Settings → Account
  HUBSPOT_FORM_GUID: "YOUR_FORM_GUID",    // HubSpot → Marketing → Forms
  CALENDLY_URL: "https://calendly.com/YOUR_LINK/consultation",
  NOTIFY_LABEL: "Harbor Point Holding — Hub"
};
```

### HubSpot custom properties (create before first lead)

| Internal name | Type | Purpose |
|---|---|---|
| `lead_source_page` | Single-line text | Which lane page converted |
| `property_type` | Single-line text | Asset type from intake |
| `goal` | Single-line text | Situation / motivation |
| `timeline` | Single-line text | Urgency band |
| `deal_lane` | Dropdown | Sell Fast / Lifeline / Commercial / Advisory / Landlord |

### Pipeline stages

`New Lead → Contacted → Consultation Held → Offer/Proposal Out → Under Contract → Closed Won/Lost`

### Workflows

1. **Instant Alert** — form submit → email/push with lane + town + urgency in subject
2. **Hot Lead Flag** — timeline "ASAP" or lane "Lifeline" → priority alert
3. **No-Booking Nudge** — +1hr / +2d / +5d Calendly follow-ups, stop on booking or reply
4. **Stale Lead Sweep** — 14 days inactive → task on dashboard

> Subscription rule: full HubSpot workflows require a qualifying Professional or Enterprise subscription. On Free, use form notifications and supported simple form automations; create Deals and routing tasks through the approved backend.

---

## Deployment

### Option A — Vercel (recommended, free)

```bash
git clone https://github.com/ACoolNerd/HarborPointHolding.git
cd HarborPointHolding
npx vercel --prod
```

Then in GoDaddy DNS for `harborpointholding.com`:
- `A` record `@` → `76.76.21.21`
- `CNAME` record `www` → `cname.vercel-dns.com`

Rename `index.html` → `index.html` (or add a `vercel.json` rewrite) so the hub loads at the root.

### Option B — GoDaddy Web Hosting Deluxe (already purchased)

The 7/17/2026 order includes Web Hosting Deluxe ($119.88/yr). If keeping it: upload all six HTML files via cPanel File Manager to `public_html/`, rename `index.html` → `index.html`, done. If not keeping it: GoDaddy hosting has a 30-day money-back window — cancel from **My Products → Web Hosting → Cancel** and deploy on Vercel free instead. Either path works; don't pay for both mindsets.

---

## Lead Flow

```
Ad / Letter / Search
        ↓
Lane landing page (source tag set)
        ↓
Conversational intake (5 steps, ~60 sec)
        ↓
HubSpot Forms API submission
   ├── Contact created / updated
   ├── Deal created only by the approved backend or supported automation
   ├── Default routing lane: harborpoint_market
   └── Instant alert → Harbor Point lead queue
        ↓
Calendly "Book Direct" (utm_source attached)
        ↓
No booking? → automated nudge sequence
```

---

## Marketing Map

| Lane | Audience | Primary channels |
|---|---|---|
| Sell Fast | Homeowners needing speed | Google Search, Facebook local, direct mail |
| Lifeline | Owners with lis pendens filings | Attorney-reviewed direct mail, door knocking |
| Commercial | CRE owners: vacancy, estate, exit | LinkedIn, LoopNet/Crexi, broker referrals |
| Advisory | Underused property, stalled projects | LinkedIn content, Google Search, professional referrals |
| Landlord | Tired / accidental landlords | Facebook groups, absentee-owner mail, REIA |

**Rule:** paid traffic never hits the hub — always the lane page.

---

## Compliance Notes

- **Lifeline lane:** Connecticut regulates foreclosure-related consulting and outreach. All Lifeline mail/scripts require attorney review before deployment. The page copy must lead with homeowner options and referral to qualified counselors or attorneys.
- **Separate licensed-practice lane:** no individual or brokerage is presented as Harbor Point's owner or operator. A lead may enter a separately governed licensed real-estate practice lane only after consent, eligibility review, required disclosures, and human approval.
- No legal, tax, or investment advice is given anywhere in the system.
- Not affiliated with the Harbor Point development in Stamford, CT (disclaimed in site footer).

---

## Status

- [x] Domain registered — harborpointholding.com
- [x] 6-page site built
- [x] System blueprint + launch cost card
- [x] CRE outreach script library
- [x] HubSpot portal ID / form GUID wired in the public form configuration
- [ ] Calendly event live
- [ ] DNS pointed / site deployed
- [ ] First campaign launched

---

*Manifested from 0 → ∞ · ACoolECOSYSTEM build · July 2026*
