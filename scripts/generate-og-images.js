#!/usr/bin/env node
/**
 * Generate branded OG images (1200x630 PNG) for lisatmiller.ai
 * Navy (#0B1B1E) + Amber (#D97706) + Switzer/Arial fallback
 * Uses sharp (rsvg built-in) to render SVG -> PNG.
 *
 * SVG intermediates are written to /tmp, never to the output dir,
 * so only PNG files end up in images/og/.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('/workspace/node_modules/sharp');

const OUT_DIR = '/workspace/lisatmiller-ai/public_html/images/og';
const TMP_DIR = '/tmp/lisatmiller-ai-og-svg';
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

// Brand palette
const NAVY   = '#0B1B1E';
const NAVY2  = '#0E2428';   // subtle gradient end
const AMBER  = '#D97706';
const AMBER2 = '#F59E0B';   // lighter amber for accents
const WHITE  = '#FFFFFF';
const MUTED  = '#8FA6B0';   // cool muted slate for subtitle
const BRAND  = 'lisatmiller.ai';

// Page specs: [filename, title, subtitle, badge]
const PAGES = [
  ['og-home',                       'Lisa T. Miller',                                     'AI Strategy for Hospital & Health System Operations', 'HOME'],
  ['og-services',                   'Services',                                           'AI Assessment, Installation, and Enablement',         'SERVICES'],
  ['og-about',                      'About Lisa T. Miller',                               '30+ Years Inside Hospital Operations',                'ABOUT'],
  ['og-ai-healthcare',              'AI for Healthcare',                                  'What AI Can Do in Healthcare Today',                  'AI · HEALTHCARE'],
  ['og-ai-business',                'AI for the Business of Healthcare',                  'Nine Areas Where AI Carries Real Work',               'AI · BUSINESS'],
  ['og-resources',                  'Resources',                                          'Articles and Guides on AI in Healthcare',             'RESOURCES'],
  ['og-contact',                    'Contact Lisa T. Miller',                             'Schedule an Executive Strategy Call',                 'CONTACT'],
  ['og-statistics',                 'Statistics and Benchmarks',                          'AI and the Business of Healthcare',                   'DATA'],
  ['og-where-does-ai-fit',          'Where Does AI Fit?',                                 'AI Readiness Assessment — 8 Questions, 3 Minutes',    'INTERACTIVE'],
  ['og-article-revenue-cycle',      'What AI Can Actually Do for the Revenue Cycle',      'An honest look at where AI carries weight today',     'ARTICLE'],
  ['og-article-cfo-guide',          "Deciding Where AI Fits, a CFO Guide",               'A framework for evaluating AI investments',           'ARTICLE'],
  ['og-article-software-purchase',  'AI Is Not a Software Purchase',                      'Why AI is an operating shift, not a line item',       'ARTICLE'],
  ['og-article-work-nobody',        'The Work Nobody Went Into Healthcare to Do',         'AI for the operational work that buries teams',       'ARTICLE'],
  ['og-article-broken-processes',   'Your Best People Carry Your Most Broken Processes',  'How broken processes hide behind your top talent',    'ARTICLE'],
  ['og-article-selling-intelligence','Everyone Is Selling Intelligence',                  'How to tell real capability from marketing',          'ARTICLE'],
];

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Word-wrap a title into <= maxLines lines that each fit within maxChars.
 * Returns array of lines. Tries to balance line lengths.
 */
function wrapTitle(text, maxChars, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const candidate = cur ? cur + ' ' + w : w;
    if (candidate.length <= maxChars || !cur) {
      cur = candidate;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);

  // If over maxLines, merge tail lines aggressively (allow longer last line)
  if (lines.length > maxLines) {
    const merged = lines.slice(0, maxLines - 1);
    const tail = lines.slice(maxLines - 1).join(' ');
    merged.push(tail);
    return merged;
  }
  return lines;
}

/**
 * Build the SVG for one OG image.
 */
function makeSvg(title, subtitle, badge) {
  // Adaptive wrapping based on title length
  const len = title.length;
  let maxChars, maxLines, titleSize, lineHeight, titleY;
  if (len <= 22) {
    maxChars = 22; maxLines = 2; titleSize = 68; lineHeight = 78; titleY = 250;
  } else if (len <= 34) {
    maxChars = 30; maxLines = 2; titleSize = 56; lineHeight = 66; titleY = 250;
  } else if (len <= 52) {
    maxChars = 30; maxLines = 2; titleSize = 48; lineHeight = 58; titleY = 245;
  } else {
    maxChars = 32; maxLines = 3; titleSize = 42; lineHeight = 52; titleY = 215;
  }

  const lines = wrapTitle(title, maxChars, maxLines);

  // Recompute title size if wrapping forced 3 lines on a short title
  if (lines.length >= 3 && titleSize > 48) {
    titleSize = 48; lineHeight = 58; titleY = 245;
  }

  const titleElements = lines.map((line, i) => {
    const y = titleY + i * lineHeight;
    return `<text x="64" y="${y}" font-size="${titleSize}" font-weight="700" fill="${WHITE}" letter-spacing="-1.2" font-family="Switzer, 'Helvetica Neue', Arial, sans-serif">${escapeXml(line)}</text>`;
  }).join('\n  ');

  const subtitleY = titleY + lines.length * lineHeight + 38;

  // Badge pill (top-left). Width scales with text length.
  const badgeW = Math.max(110, badge.length * 8.6 + 30);
  const badgeSvg = `
  <rect x="64" y="60" width="${badgeW}" height="34" rx="17" fill="${AMBER}" opacity="0.18"/>
  <text x="${64 + (badgeW) / 2}" y="82" font-size="13" font-weight="700" fill="${AMBER2}" font-family="Switzer, 'Helvetica Neue', Arial, sans-serif" letter-spacing="1.6" text-anchor="middle">${escapeXml(badge)}</text>`;

  // Amber accent bar on the far left (vertical), plus a short amber underline
  // under the title block for emphasis.
  const accentBar = `
  <rect x="0" y="0" width="8" height="630" fill="${AMBER}"/>
  <rect x="0" y="0" width="8" height="220" fill="${AMBER2}" opacity="0.55"/>`;

  // Right-side subtle amber geometric accent (simple shapes, low opacity)
  const rightAccent = `
  <rect x="1090" y="0" width="110" height="630" fill="${AMBER}" opacity="0.05"/>
  <circle cx="1130" cy="120" r="46" fill="none" stroke="${AMBER}" stroke-width="2" opacity="0.22"/>
  <circle cx="1130" cy="120" r="22" fill="${AMBER}" opacity="0.10"/>
  <rect x="1108" y="430" width="80" height="80" rx="14" fill="none" stroke="${AMBER}" stroke-width="2" opacity="0.22"/>
  <rect x="1126" y="448" width="44" height="44" rx="8" fill="${AMBER}" opacity="0.10"/>`;

  // Subtle dot grid in upper-left area (very low opacity)
  const dots = `
  <g opacity="0.05" fill="${WHITE}">
    <circle cx="180" cy="150" r="2.5"/><circle cx="260" cy="120" r="1.8"/><circle cx="340" cy="170" r="2.2"/>
    <circle cx="220" cy="210" r="1.6"/><circle cx="380" cy="110" r="2"/><circle cx="300" cy="260" r="1.8"/>
  </g>`;

  // Footer: amber tick + brand name
  const footer = `
  <rect x="64" y="572" width="56" height="4" rx="2" fill="${AMBER}"/>
  <text x="136" y="578" font-size="15" font-weight="600" fill="${MUTED}" font-family="Switzer, 'Helvetica Neue', Arial, sans-serif">${escapeXml(BRAND)}</text>`;

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${NAVY}"/>
      <stop offset="100%" stop-color="${NAVY2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  ${rightAccent}
  ${dots}
  ${accentBar}
  ${badgeSvg}
  <!-- Title -->
  ${titleElements}
  <!-- Subtitle -->
  <text x="64" y="${subtitleY}" font-size="22" font-weight="400" fill="${MUTED}" font-family="Switzer, 'Helvetica Neue', Arial, sans-serif">${escapeXml(subtitle)}</text>
  ${footer}
</svg>`;
}

async function main() {
  let ok = 0, fail = 0;
  for (const [name, title, subtitle, badge] of PAGES) {
    const svg = makeSvg(title, subtitle, badge);
    const svgPath = path.join(TMP_DIR, name + '.svg');
    const pngPath = path.join(OUT_DIR, name + '.png');
    fs.writeFileSync(svgPath, svg);
    try {
      await sharp(svgPath, { density: 144 })
        .resize(1200, 630, { fit: 'fill' })
        .png({ compressionLevel: 6, quality: 100 })
        .toFile(pngPath);
      const sz = fs.statSync(pngPath).size;
      console.log(`OK   ${name}.png  (${(sz / 1024).toFixed(0)} KB)`);
      ok++;
    } catch (e) {
      console.error(`FAIL ${name}: ${e.message}`);
      fail++;
    }
  }

  // Clean up SVG intermediates
  for (const f of fs.readdirSync(TMP_DIR)) {
    if (f.endsWith('.svg')) fs.unlinkSync(path.join(TMP_DIR, f));
  }
  fs.rmdirSync(TMP_DIR);

  // Verify output dir contains only PNGs
  const remaining = fs.readdirSync(OUT_DIR);
  const svgLeft = remaining.filter(f => f.endsWith('.svg'));
  if (svgLeft.length) {
    console.error(`WARNING: SVG files left in output dir: ${svgLeft.join(', ')}`);
    for (const f of svgLeft) fs.unlinkSync(path.join(OUT_DIR, f));
  }

  console.log(`\nDone: ${ok} OK, ${fail} failed. Output: ${OUT_DIR}`);
  console.log('Files in output dir:', fs.readdirSync(OUT_DIR).join(', '));
}

main().catch(e => { console.error(e); process.exit(1); });
