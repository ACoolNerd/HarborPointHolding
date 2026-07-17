const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const LEADS_FILE = path.join(__dirname, 'leads.json');

// Ensure JSON leads store exists
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets and web pages from root
app.use(express.static(__dirname));

// Utility to read leads
function readLeads() {
  try {
    const data = fs.readFileSync(LEADS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading leads file:", err);
    return [];
  }
}

// Utility to write leads
function writeLeads(leads) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch (err) {
    console.error("Error writing leads file:", err);
  }
}

// Get drip touchpoints based on lane and lead data
function generateDripSchedule(lead) {
  const city = lead.city || 'Connecticut';
  const name = lead.firstname || 'there';
  const type = lead.property_type || 'property';
  
  return [
    {
      day: 1,
      channel: 'SMS & Email',
      subject: 'Instant Speed-to-Lead Check-in',
      message: `Hi ${name}, Keith here from Harbor Point Holding. We received your CT property strategy inquiry for the ${type} in ${city}. Do you have 5 minutes for a quick introductory call today?`,
      status: 'Sent',
      timestamp: new Date().toISOString()
    },
    {
      day: 3,
      channel: 'Email',
      subject: 'Case Study: As-Is Portfolio Exit',
      message: `Hi ${name}, I wanted to share a quick case study of how we recently helped a landlord in Hartford exit their multifamily portfolio as-is, saving $40k in broker commissions. Let's see if we can do the same for your ${type}.`,
      status: 'Scheduled',
      timestamp: null
    },
    {
      day: 7,
      channel: 'Email',
      subject: 'As-Is Direct Buyout vs. Traditional Listing Analysis',
      message: `Hi ${name}, we completed a preliminary valuation of ${type} assets in ${city}. Let's compare what you'd walk away with in a direct sale versus a 6-month listing.`,
      status: 'Scheduled',
      timestamp: null
    },
    {
      day: 14,
      channel: 'SMS',
      subject: 'Soft Follow-up',
      message: `Hi ${name}, just checking in to see if you have any updates on your timeline for the ${city} property. Let me know if you want to chat.`,
      status: 'Scheduled',
      timestamp: null
    },
    {
      day: 30,
      channel: 'Email',
      subject: 'Monthly Connecticut Market Update',
      message: `Hi ${name}, here is our monthly Connecticut Commercial Real Estate update. Industrial and retail demand remains strong in your submarket. View the chart...`,
      status: 'Scheduled',
      timestamp: null
    }
  ];
}

/* ============ API ROUTES ============ */

// 1. Submit Intake Form
app.post('/api/intake', (req, res) => {
  const { firstname, email, phone, city, property_type, goal, timeline, lead_source_page } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  
  const leads = readLeads();
  
  const newLead = {
    id: 'ld_' + Math.random().toString(36).substr(2, 9),
    firstname: firstname || 'Anonymous',
    email,
    phone: phone || '',
    city: city || 'Unknown',
    property_type: property_type || 'Not Specified',
    goal: goal || 'Not Specified',
    timeline: timeline || 'Not Specified',
    lead_source_page: lead_source_page || 'harborpoint-direct',
    pipeline_stage: 'New Lead',
    created_at: new Date().toISOString(),
    drip_schedule: []
  };
  
  newLead.drip_schedule = generateDripSchedule(newLead);
  
  leads.unshift(newLead);
  writeLeads(leads);
  
  console.log(`[Lead Logged] ${newLead.firstname} (${newLead.email}) via ${newLead.lead_source_page}`);
  res.status(201).json({ success: true, lead: newLead });
});

// 2. Fetch All Leads
app.get('/api/leads', (req, res) => {
  res.json(readLeads());
});

// 3. Update Lead Pipeline Stage
app.post('/api/leads/update-stage', (req, res) => {
  const { leadId, stage } = req.body;
  const leads = readLeads();
  const idx = leads.findIndex(l => l.id === leadId);
  
  if (idx !== -1) {
    leads[idx].pipeline_stage = stage;
    writeLeads(leads);
    return res.json({ success: true, lead: leads[idx] });
  }
  
  res.status(404).json({ error: "Lead not found" });
});

// 4. Competitor Benchmark Analysis
app.get('/api/competitors', (req, res) => {
  res.json({
    metrics: [
      {
        company: 'Harbor Point Holding',
        turnaround: '24-48 Hours',
        commission: '0% (Direct)',
        closing_time: '7-14 Days',
        satisfaction: '98%',
        drip_cadence: '5 value touches over 30 days',
        diligence_vdr: 'Custom Secure VDR checklist'
      },
      {
        company: 'Summit Holding',
        turnaround: '72 Hours',
        commission: '0% (Direct)',
        closing_time: '14-30 Days',
        satisfaction: '91%',
        drip_cadence: 'Weekly automated check-ins',
        diligence_vdr: 'Generic file drop links'
      },
      {
        company: 'Traditional Brokerages',
        turnaround: '2-4 Weeks',
        commission: '5-6% Brokerage Fee',
        closing_time: '60-90+ Days',
        satisfaction: '84%',
        drip_cadence: 'Manual agent outreach',
        diligence_vdr: 'Third-party secure rooms (expensive)'
      }
    ]
  });
});

// 5. Dashboard Summary Statistics
app.get('/api/dashboard-stats', (req, res) => {
  const leads = readLeads();
  const stagesCount = {
    'New Lead': 0,
    'Contacted': 0,
    'Consultation Held': 0,
    'Offer/Proposal Out': 0,
    'Under Contract': 0,
    'Closed Won': 0,
    'Closed Lost': 0
  };
  
  leads.forEach(l => {
    if (stagesCount[l.pipeline_stage] !== undefined) {
      stagesCount[l.pipeline_stage]++;
    }
  });
  
  const sources = {};
  leads.forEach(l => {
    sources[l.lead_source_page] = (sources[l.lead_source_page] || 0) + 1;
  });
  
  res.json({
    total_leads: leads.length,
    pipeline_stages: stagesCount,
    source_attribution: sources
  });
});

// Serve dashboard.html directly at /dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`HARBOR POINT HOLDING LOCAL HOSTING`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`ADMIN COCKPIT: http://localhost:${PORT}/dashboard`);
  console.log(`====================================================`);
});
