const sharp = require('sharp');
const fs = require('fs');

const W = 1200, H = 1800;
const navy = '#0B1B1E';
const amber = '#D97706';
const amberLight = '#F59E0B';
const white = '#FFFFFF';
const slate = '#64748B';
const slateLight = '#94A3B8';
const band = '#132D33';
const line = '#1E3A42';

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" font-family="Arial, Helvetica, sans-serif">

<!-- Background -->
<rect width="${W}" height="${H}" fill="${navy}"/>

<!-- Subtle gradient overlay -->
<defs>
  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${navy}" stop-opacity="1"/>
    <stop offset="50%" stop-color="${band}" stop-opacity="0.6"/>
    <stop offset="100%" stop-color="${navy}" stop-opacity="1"/>
  </linearGradient>
  <linearGradient id="amberGrad" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${amber}"/>
    <stop offset="100%" stop-color="${amberLight}"/>
  </linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#grad)"/>

<!-- Top accent bar -->
<rect x="0" y="0" width="${W}" height="8" fill="url(#amberGrad)"/>

<!-- Header section -->
<text x="80" y="80" fill="${amber}" font-size="16" font-weight="700" letter-spacing="3">LISA T. MILLER</text>
<text x="80" y="130" fill="${white}" font-size="42" font-weight="800">AI and the Business of Healthcare</text>
<text x="80" y="175" fill="${slateLight}" font-size="24" font-weight="400">Statistics and Benchmarks, 2026</text>

<!-- Divider -->
<rect x="80" y="200" width="200" height="3" fill="${amber}"/>

<!-- Key Stats Row (4 big numbers) -->
<g transform="translate(80, 240)">
  <text x="0" y="0" fill="${slateLight}" font-size="13" font-weight="600" letter-spacing="2">THE NUMBERS AT A GLANCE</text>
</g>

<!-- Stat 1 -->
<g transform="translate(80, 280)">
  <rect x="0" y="0" width="240" height="140" rx="12" fill="${band}" stroke="${line}" stroke-width="1"/>
  <text x="20" y="55" fill="${amber}" font-size="52" font-weight="800">~25%</text>
  <text x="20" y="85" fill="${white}" font-size="14" font-weight="600">of hospital spending is</text>
  <text x="20" y="105" fill="${white}" font-size="14" font-weight="600">administration, not care</text>
  <text x="20" y="128" fill="${slate}" font-size="11">Health Affairs, 2014</text>
</g>

<!-- Stat 2 -->
<g transform="translate(340, 280)">
  <rect x="0" y="0" width="240" height="140" rx="12" fill="${band}" stroke="${line}" stroke-width="1"/>
  <text x="20" y="55" fill="${amber}" font-size="52" font-weight="800">$19.7B</text>
  <text x="20" y="85" fill="${white}" font-size="14" font-weight="600">spent yearly pursuing</text>
  <text x="20" y="105" fill="${white}" font-size="14" font-weight="600">denial appeals</text>
  <text x="20" y="128" fill="${slate}" font-size="11">Premier Inc., 2022</text>
</g>

<!-- Stat 3 -->
<g transform="translate(600, 280)">
  <rect x="0" y="0" width="240" height="140" rx="12" fill="${band}" stroke="${line}" stroke-width="1"/>
  <text x="20" y="55" fill="${amber}" font-size="52" font-weight="800">13 hrs</text>
  <text x="20" y="85" fill="${white}" font-size="14" font-weight="600">per physician per week</text>
  <text x="20" y="105" fill="${white}" font-size="14" font-weight="600">on prior authorization</text>
  <text x="20" y="128" fill="${slate}" font-size="11">AMA, 2024</text>
</g>

<!-- Stat 4 -->
<g transform="translate(860, 280)">
  <rect x="0" y="0" width="240" height="140" rx="12" fill="${band}" stroke="${line}" stroke-width="1"/>
  <text x="20" y="55" fill="${amber}" font-size="52" font-weight="800">3.2:1</text>
  <text x="20" y="85" fill="${white}" font-size="14" font-weight="600">average ROI on</text>
  <text x="20" y="105" fill="${white}" font-size="14" font-weight="600">healthcare AI</text>
  <text x="20" y="128" fill="${slate}" font-size="11">Industry compilations, 2025</text>
</g>

<!-- Section: What Health Systems Want -->
<g transform="translate(80, 470)">
  <text x="0" y="0" fill="${slateLight}" font-size="13" font-weight="600" letter-spacing="2">WHAT HEALTH SYSTEMS WANT FROM AI</text>
  <text x="0" y="30" fill="${white}" font-size="20" font-weight="700">Top goals for deploying AI in 43 U.S. health systems</text>
  <text x="0" y="55" fill="${slate}" font-size="12">Poon et al., JAMIA 2025</text>
</g>

<!-- Chart bars -->
<g transform="translate(80, 560)">
  <!-- Caregiver Burden 72% -->
  <text x="0" y="18" fill="${white}" font-size="15" font-weight="600">Caregiver Burden / Satisfaction</text>
  <rect x="0" y="28" width="${1040-10}" height="32" rx="4" fill="${band}" stroke="${line}" stroke-width="1"/>
  <rect x="0" y="28" width="${(1040-10)*0.72}" height="32" rx="4" fill="${amber}"/>
  <text x="${(1040-10)*0.72-50}" y="50" fill="${navy}" font-size="14" font-weight="800">72%</text>

  <!-- Patient Safety 56% -->
  <text x="0" y="88" fill="${white}" font-size="15" font-weight="600">Patient Safety / Quality</text>
  <rect x="0" y="98" width="${1040-10}" height="32" rx="4" fill="${band}" stroke="${line}" stroke-width="1"/>
  <rect x="0" y="98" width="${(1040-10)*0.56}" height="32" rx="4" fill="${amber}"/>
  <text x="${(1040-10)*0.56-50}" y="120" fill="${navy}" font-size="14" font-weight="800">56%</text>

  <!-- Workflow Efficiency 53% -->
  <text x="0" y="158" fill="${white}" font-size="15" font-weight="600">Workflow Efficiency / Productivity</text>
  <rect x="0" y="168" width="${1040-10}" height="32" rx="4" fill="${band}" stroke="${line}" stroke-width="1"/>
  <rect x="0" y="168" width="${(1040-10)*0.53}" height="32" rx="4" fill="${amber}"/>
  <text x="${(1040-10)*0.53-50}" y="190" fill="${navy}" font-size="14" font-weight="800">53%</text>

  <!-- Margin Improvement 12% -->
  <text x="0" y="228" fill="${white}" font-size="15" font-weight="600">Margin Improvement / Financial</text>
  <rect x="0" y="238" width="${1040-10}" height="32" rx="4" fill="${band}" stroke="${line}" stroke-width="1"/>
  <rect x="0" y="238" width="${(1040-10)*0.12}" height="32" rx="4" fill="${slate}"/>
  <text x="${(1040-10)*0.12+8}" y="260" fill="${white}" font-size="14" font-weight="800">12%</text>

  <!-- Patient Experience 5% -->
  <text x="0" y="298" fill="${white}" font-size="15" font-weight="600">Patient / Consumer Experience</text>
  <rect x="0" y="308" width="${1040-10}" height="32" rx="4" fill="${band}" stroke="${line}" stroke-width="1"/>
  <rect x="0" y="308" width="${(1040-10)*0.05}" height="32" rx="4" fill="${slate}"/>
  <text x="${(1040-10)*0.05+8}" y="330" fill="${white}" font-size="14" font-weight="800">5%</text>
</g>

<!-- Section: AI Adoption -->
<g transform="translate(80, 930)">
  <text x="0" y="0" fill="${slateLight}" font-size="13" font-weight="600" letter-spacing="2">AI ADOPTION IN HEALTH SYSTEMS</text>
</g>

<!-- Adoption stat cards -->
<g transform="translate(80, 960)">
  <rect x="0" y="0" width="340" height="100" rx="12" fill="${band}" stroke="${line}" stroke-width="1"/>
  <text x="20" y="45" fill="${amber}" font-size="36" font-weight="800">~80%</text>
  <text x="20" y="70" fill="${white}" font-size="13">of hospitals use AI in at least</text>
  <text x="20" y="88" fill="${white}" font-size="13">one clinical or operational function</text>
</g>
<g transform="translate(430, 960)">
  <rect x="0" y="0" width="340" height="100" rx="12" fill="${band}" stroke="${line}" stroke-width="1"/>
  <text x="20" y="45" fill="${amber}" font-size="36" font-weight="800">~1,250</text>
  <text x="20" y="70" fill="${white}" font-size="13">AI/ML medical devices cleared</text>
  <text x="20" y="88" fill="${white}" font-size="13">by the FDA as of May 2025</text>
</g>
<g transform="translate(780, 960)">
  <rect x="0" y="0" width="340" height="100" rx="12" fill="${band}" stroke="${line}" stroke-width="1"/>
  <text x="20" y="45" fill="${amber}" font-size="36" font-weight="800">40-45%</text>
  <text x="20" y="70" fill="${white}" font-size="13">reduction in physician</text>
  <text x="20" y="88" fill="${white}" font-size="13">documentation time with AI scribes</text>
</g>

<!-- Section: The Opportunity -->
<g transform="translate(80, 1110)">
  <text x="0" y="0" fill="${slateLight}" font-size="13" font-weight="600" letter-spacing="2">THE OPPORTUNITY</text>
</g>

<!-- Opportunity stats -->
<g transform="translate(80, 1140)">
  <rect x="0" y="0" width="510" height="110" rx="12" fill="${band}" stroke="${line}" stroke-width="1"/>
  <text x="20" y="45" fill="${amber}" font-size="36" font-weight="800">$25-$181</text>
  <text x="20" y="72" fill="${white}" font-size="14">cost to rework a single denied claim</text>
  <text x="20" y="95" fill="${slate}" font-size="11">MGMA. Premier reports avg $44/claim</text>
</g>
<g transform="translate(610, 1140)">
  <rect x="0" y="0" width="510" height="110" rx="12" fill="${band}" stroke="${line}" stroke-width="1"/>
  <text x="20" y="45" fill="${amber}" font-size="36" font-weight="800">12-18 mo</text>
  <text x="20" y="72" fill="${white}" font-size="14">typical payback period for healthcare AI</text>
  <text x="20" y="95" fill="${slate}" font-size="11">Industry ROI compilations, 2025</text>
</g>

<g transform="translate(80, 1270)">
  <rect x="0" y="0" width="510" height="110" rx="12" fill="${band}" stroke="${line}" stroke-width="1"/>
  <text x="20" y="45" fill="${amber}" font-size="36" font-weight="800">93%</text>
  <text x="20" y="72" fill="${white}" font-size="14">of physicians say prior auth delays care</text>
  <text x="20" y="95" fill="${slate}" font-size="11">AMA 2024 Physician Practice Survey</text>
</g>
<g transform="translate(610, 1270)">
  <rect x="0" y="0" width="510" height="110" rx="12" fill="${band}" stroke="${line}" stroke-width="1"/>
  <text x="20" y="45" fill="${amber}" font-size="36" font-weight="800">$200-400B</text>
  <text x="20" y="72" fill="${white}" font-size="14">annual cost AI could remove from healthcare</text>
  <text x="20" y="95" fill="${slate}" font-size="11">Aggregated industry analyses, 2024</text>
</g>

<!-- Section: The Gap -->
<g transform="translate(80, 1430)">
  <text x="0" y="0" fill="${slateLight}" font-size="13" font-weight="600" letter-spacing="2">THE STRUCTURAL GAP</text>
  <text x="0" y="35" fill="${white}" font-size="22" font-weight="700">Broad adoption, shallow maturity</text>
  <text x="0" y="65" fill="${slateLight}" font-size="15">80% of hospitals run AI somewhere.</text>
  <text x="0" y="90" fill="${slateLight}" font-size="15">Less than 20% have it embedded in core workflows.</text>
  <text x="0" y="120" fill="${white}" font-size="15">That gap is where the financial return lives.</text>
</g>

<!-- Bottom accent bar -->
<rect x="0" y="${H-60}" width="${W}" height="4" fill="${amber}"/>

<!-- Footer -->
<text x="80" y="${H-25}" fill="${slate}" font-size="13" font-weight="600">lisatmiller.ai/statistics</text>
<text x="${W-80}" y="${H-25}" fill="${slate}" font-size="13" text-anchor="end">Every figure sourced. Updated July 2026.</text>

</svg>`;

const outPath = '/workspace/lisatmiller-ai/public_html/images/healthcare-ai-statistics-infographic.png';
sharp(Buffer.from(svg))
  .png()
  .toFile(outPath)
  .then(() => {
    const stats = fs.statSync(outPath);
    console.log(`Infographic generated: ${outPath} (${(stats.size/1024).toFixed(0)}KB)`);
  })
  .catch(err => console.error('Error:', err));
