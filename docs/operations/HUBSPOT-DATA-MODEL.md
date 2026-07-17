# HubSpot Data Model

## Objects

| Object | Harbor Point record |
|---|---|
| Contact | Person |
| Company | Ownership, operating, professional, or referral entity |
| Deal | One property opportunity or engagement |
| Activity | Call, email, meeting, approved outreach, or task |
| Property custom object | Optional only when the subscription supports it; otherwise use Deal fields |

A form submission creates or updates a Contact. It does not guarantee that a Deal exists. Deal creation and associations require the approved backend or a supported automation.

## Core fields

| Group | Fields |
|---|---|
| Attribution | `lead_source_page`, `source_channel`, `source_campaign`, UTM fields, first and last touch |
| Property | address, town, state, postal code, parcel ID, asset type, occupancy, source URL, retrieval date |
| Opportunity | deal lane, score, confidence, score reasons, timeline, next action, last verified |
| Routing | routing lane, status, reason, approval, reviewer, approval time |
| Consent | referral consent, consent time, consent source, do-not-contact |
| Evidence | verification status, conflicting evidence, source-rights note |

## Pipeline

`New → Enrichment Pending → Qualified → Outreach Approval → Contacted → Engaged → Consultation → Diligence → Proposal or Listing → Won / Lost / Nurture`

## Reliability

- Normalize before deduplication.
- Associate Deal to every known Contact and Company.
- Validate response status; never show success on a failed submission.
- Retry 429 and retryable 5xx responses with backoff.
- Preserve failed submissions for manual recovery.
- Keep authentication secrets in a secret manager.
- Treat portal and form identifiers as public configuration, not authentication.
- Preserve immutable submission, consent, routing, sync, and failure events.
