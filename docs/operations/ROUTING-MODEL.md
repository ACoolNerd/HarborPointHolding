# Harbor Point Routing Model

## Boundary

Harbor Point is the neutral market, intake, and property-intelligence layer. It does not publicly identify an individual owner, operator, buyer, broker, agent, REALTOR®, or brokerage.

The KW practice is a separately governed downstream lane. Harbor Point may introduce a qualified and consenting lead to that lane; the practice does not own or operate Harbor Point through this flow.

## Routing lanes

| Lane | Use | Approval |
|---|---|---|
| `harborpoint_market` | Default intake, research, qualification, and nurture | Internal review |
| `harborpoint_commercial` | Commercial, multifamily, mixed-use, landlord, redevelopment, and advisory matters | Qualification review |
| `professional_referral` | Attorney, engineer, architect, lender, insurer, appraiser, surveyor, tax, construction, or management need | Consent + human approval |
| `kw_practice` | Licensed real-estate practice conversation | Consent + eligibility + brokerage/compliance review + human approval |
| `hold_for_review` | Missing authority, consent, evidence, role clarity, or permitted-use basis | Blocked |
| `do_not_contact` | Suppression, opt-out, legal restriction, or user direction | Blocked |

## State machine

`captured → validated → enriched → scored → route_proposed → consent_pending → approval_pending → approved → referred`

Any rights, consent, compliance, identity, or evidence failure moves the record to `hold_for_review` or `do_not_contact`.

## KW gate

All conditions must be true:

- licensed real-estate representation or an approved brokerage-related service is appropriate;
- the lead consented to the introduction or another documented lawful basis applies;
- Harbor Point public copy does not imply practice ownership or operation;
- brokerage, advertising, referral, fair-housing, and brand requirements are approved;
- `routing_approved=true` includes reviewer and timestamp.

No agent may bypass this gate.
