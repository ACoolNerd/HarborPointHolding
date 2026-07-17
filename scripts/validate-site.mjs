import fs from 'node:fs';

const pages = [
  'index.html',
  'hp-sell-fast.html',
  'hp-lifeline.html',
  'hp-commercial.html',
  'hp-advisory.html',
  'hp-landlord.html'
];

const errors = [];
const sourceTags = new Set();
const portalIds = new Set();
const formGuids = new Set();
const forbidden = [
  /Keller Williams/i,
  /KW Legacy/i,
  /Principal &amp; Owner/i
];

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');

  if (/YOUR_PORTAL_ID|YOUR_FORM_GUID/.test(html)) {
    errors.push(file + ': unresolved HubSpot placeholder');
  }
  if (!html.includes('if(!response.ok)')) {
    errors.push(file + ': HubSpot response status is not checked');
  }
  if (!html.includes('ROUTING_LANE: "harborpoint_market"')) {
    errors.push(file + ': neutral routing default is missing');
  }
  for (const pattern of forbidden) {
    if (pattern.test(html)) errors.push(file + ': forbidden public identity reference ' + pattern);
  }

  const source = html.match(/SOURCE_TAG:\s*"([^"]+)"/);
  const portal = html.match(/HUBSPOT_PORTAL_ID:\s*"([^"]+)"/);
  const form = html.match(/HUBSPOT_FORM_GUID:\s*"([^"]+)"/);
  if (!source) errors.push(file + ': source tag missing');
  else sourceTags.add(source[1]);
  if (!portal) errors.push(file + ': portal ID missing');
  else portalIds.add(portal[1]);
  if (!form) errors.push(file + ': form GUID missing');
  else formGuids.add(form[1]);
}

if (sourceTags.size !== pages.length) errors.push('source tags must be unique across all pages');
if (portalIds.size !== 1) errors.push('all pages must use one HubSpot portal ID');
if (formGuids.size !== 1) errors.push('all pages must use one HubSpot form GUID');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validated ' + pages.length + ' neutral Harbor Point intake pages.');
