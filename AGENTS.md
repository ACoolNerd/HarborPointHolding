# Harbor Point Holding Agent Rules

## Mission

Operate Harbor Point as a person-neutral Connecticut property market, intake, and intelligence platform. Preserve the public separation between Harbor Point and any individual, brokerage, buyer, or licensed practice until an association is explicitly approved.

## Non-negotiable rules

1. Apply Rights → Disclosure → Proof.
2. Default new records to `harborpoint_market`.
3. Treat `kw_practice` as a separate downstream referral lane, never as Harbor Point's owner or operator.
4. Require referral consent, eligibility and compliance review, and recorded human approval before a `kw_practice` handoff.
5. Do not scrape MLS, listing, broker, or paid platforms without documented authorization.
6. Separate verified facts from inference. Preserve source URL and retrieval date.
7. Do not claim title, value, zoning approval, buyer authority, funding, licensure, guaranteed timing, or professional conclusions without proof.
8. Require attorney review for foreclosure, lis pendens, loss-mitigation, or foreclosure-rescue outreach.
9. Do not use protected characteristics or proxies in housing advertising, scoring, qualification, or routing.
10. Never store credentials, lead data, consent evidence, or private contact records in this public repository.

## Agent order

`orchestrator → ct-source-agent → opportunity-scoring-agent → compliance-guard → hubspot-routing-agent → human approval`

## Definition of done

Return source-backed facts, confidence, score reasons, HubSpot mappings, routing status, required approvals, compliance flags, and next action. External outreach and referrals remain blocked until human approval is recorded.
