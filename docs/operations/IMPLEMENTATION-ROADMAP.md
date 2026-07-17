# Neutral Market Implementation Roadmap

## Completed in this change

- person-neutral Harbor Point identity;
- separate KW practice routing lane;
- known HubSpot portal and form identifiers wired across six intakes;
- failed HubSpot submissions no longer display false success;
- booking CTA hidden until an approved neutral event URL exists;
- risky direct-buyer, guaranteed-offer, funding, fee, and timing claims revised;
- public outreach scripts converted to approval-first neutral drafts;
- HubSpot routing and consent property schema expanded;
- repository agent instructions and validation added.

## Phase 1 — HubSpot account configuration

1. Create the routing, consent, source, and verification properties from `setup/hubspot-properties.csv`.
2. Add the properties to the approved forms and views.
3. Configure the Harbor Point lead-operations notification recipient.
4. Create the Deal pipeline and saved routing views.
5. Add an approved neutral Calendly URL, if used.
6. Submit one test per page and verify the source tag.

## Phase 2 — Secure lead gateway

Build a server-side endpoint using the approved Next.js/Firebase stack. Validate input, log consent, apply spam protection, submit to HubSpot, create and associate the Deal, queue failed events, and return an honest delivery state.

## Phase 3 — Connecticut intelligence MVP

Start with Greater Hartford. Ingest permitted parcel/CAMA and public entity data, normalize property and entity identifiers, retain provenance, and generate reviewable opportunity scores.

## Phase 4 — Governed automation

Run the repository agents in order. Keep outreach, referrals, and material CRM changes behind human approval. Add weekly attribution, SLA, data-quality, and routing reports.

## Release gate

Do not launch paid traffic until all six forms pass, the account uses a neutral operations identity, the KW route remains gated, suppression works, and compliance review approves each campaign.
