#!/usr/bin/env node
/**
 * Aliento Medical — Employee Wellness Pitch Deck
 * For Dr. Leegale Adonis
 * Target: Big SA Franchises (Shoprite, PnP, Game, Macro, Foschini)
 *
 * Generates a professional .pptx presentation.
 */

const PptxGenJS = require('pptxgenjs');
const path = require('path');

// ── Constants ──────────────────────────────────────────────────────────────
const TOTAL_SLIDES = 10;
const OUTPUT_PATH = path.resolve(__dirname, '..', 'public', 'pdfs', 'Aliento-Employee-Wellness-Deck.pptx');

// ── Brand Colors (NO # prefix!) ────────────────────────────────────────────
const C = {
  sageDark:   '3A5E4A',
  sage600:    '4A7059',
  sage500:    '5E8A70',
  sage400:    '7C9E8A',
  sageLight:  'A8C4B2',
  cream:      'FDF8F0',
  creamDark:  'F5EDE0',
  warm900:    '2E2A26',
  warm800:    '38332E',
  warm700:    '433E34',
  white:      'FFFFFF',
  offWhite:   'FAFAF5',
  accentGold: 'C9A96E',
};

// ── Shared Helpers ─────────────────────────────────────────────────────────

const mkShadow = () => ({
  type: 'outer',
  blur: 8,
  offset: 2,
  color: '000000',
  opacity: 0.12,
});

const mkShadowLight = () => ({
  type: 'outer',
  blur: 6,
  offset: 1,
  color: '000000',
  opacity: 0.08,
});

const pageNum = (slide, curr, total) => {
  slide.addText(`${curr} / ${total}`, {
    x: 5.5, y: 7.0, w: 1.5, h: 0.35,
    fontSize: 9, fontFace: 'Calibri', color: C.sage400,
    align: 'center', valign: 'middle',
  });
};

const tagline = (slide) => {
  slide.addText('Breathe, Screen, Live', {
    x: 4.0, y: 7.05, w: 5.0, h: 0.3,
    fontSize: 10, fontFace: 'Calibri', color: C.sage400,
    align: 'center', valign: 'middle', italic: true,
  });
};

const bottomBar = (slide, color) => {
  slide.addShape('rect', {
    x: 0, y: 7.35, w: 13.333, h: 0.15,
    fill: { color: color || C.sage500 },
  });
};

// ── Slide Builders ─────────────────────────────────────────────────────────

/** S1 — Title Slide: Dark sage, bold headline, R500 callout */
function buildSlide1(pptx) {
  const s = pptx.addSlide();
  s.background = { color: C.sageDark };

  // Decorative top accent line
  s.addShape('rect', { x: 0, y: 0, w: 13.333, h: 0.06, fill: { color: C.accentGold } });

  // Large decorative organic circle (subtle)
  s.addShape('ellipse', {
    x: 8.5, y: -1.5, w: 6, h: 6,
    fill: { color: C.sage600, transparency: 70 },
    line: { color: C.sage500, width: 0, transparency: 100 },
  });

  // Subtitle above title
  s.addText('ALIENTO MEDICAL', {
    x: 0.8, y: 1.2, w: 8, h: 0.5,
    fontSize: 13, fontFace: 'Calibri', color: C.sage400,
    bold: true, letterSpacing: 4, align: 'left',
  });

  // Main title
  s.addText([
    { text: 'Employee Wellness\n', options: { fontSize: 44, bold: true, color: C.white } },
    { text: 'That Works', options: { fontSize: 44, bold: true, color: C.accentGold } },
  ], {
    x: 0.8, y: 1.8, w: 8, h: 2.0,
    fontFace: 'Calibri', align: 'left', valign: 'top',
    lineSpacingMultiple: 1.1,
  });

  // Subtitle / Subheading
  s.addText('A comprehensive health screening & behavioural intervention\npackage for your workforce — R500 per employee per year', {
    x: 0.8, y: 4.0, w: 7.5, h: 1.0,
    fontSize: 16, fontFace: 'Calibri', color: C.sageLight,
    align: 'left', valign: 'top',
  });

  // R500 pricing pill
  s.addShape('roundRect', {
    x: 0.8, y: 5.2, w: 2.8, h: 0.7,
    fill: { color: C.sage500 },
    rectRadius: 0.125,
    shadow: mkShadow(),
  });
  s.addText('R500 / employee', {
    x: 0.8, y: 5.2, w: 2.8, h: 0.7,
    fontSize: 16, fontFace: 'Calibri', color: C.white,
    bold: true, align: 'center', valign: 'middle',
  });

  // Presenter name
  s.addText('Presented by Dr. Leegale Adonis', {
    x: 0.8, y: 6.2, w: 6, h: 0.4,
    fontSize: 13, fontFace: 'Calibri', color: C.sageLight,
    align: 'left',
  });

  tagline(s);
  bottomBar(s, C.accentGold);
  pageNum(s, 1, TOTAL_SLIDES);
}

/** S2 — The Problem: Burden of preventable disease */
function buildSlide2(pptx) {
  const s = pptx.addSlide();
  s.background = { color: C.cream };

  // Left accent bar
  s.addShape('rect', { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: C.sageDark } });

  // Section label
  s.addText('THE PROBLEM', {
    x: 0.6, y: 0.4, w: 4, h: 0.4,
    fontSize: 10, fontFace: 'Calibri', color: C.sage500,
    bold: true, letterSpacing: 3,
  });

  // Title
  s.addText('The Hidden Cost of\nPoor Health', {
    x: 0.6, y: 0.85, w: 8, h: 1.3,
    fontSize: 34, fontFace: 'Calibri', color: C.warm900,
    bold: true, align: 'left', lineSpacingMultiple: 1.1,
  });

  // Stat cards — 3 across
  const stats = [
    { num: '64%', label: 'Of deaths in SA caused by\nnon-communicable diseases', accent: C.sage500 },
    { num: '4.2M', label: 'South Africans with undiagnosed\nhypertension', accent: C.accentGold },
    { num: '< 20%', label: 'Screening uptake rate\nfor preventative health', accent: C.sageDark },
  ];

  stats.forEach((st, i) => {
    const xBase = 0.6 + i * 4.1;
    // Card background
    s.addShape('roundRect', {
      x: xBase, y: 3.0, w: 3.8, h: 2.6,
      fill: { color: C.white },
      shadow: mkShadow(),
      rectRadius: 0.1,
    });
    // Accent top line on card
    s.addShape('rect', {
      x: xBase, y: 3.0, w: 3.8, h: 0.06,
      fill: { color: st.accent },
    });
    // Big number
    s.addText(st.num, {
      x: xBase, y: 3.2, w: 3.8, h: 0.9,
      fontSize: 36, fontFace: 'Calibri', color: st.accent,
      bold: true, align: 'center', valign: 'middle',
    });
    // Label
    s.addText(st.label, {
      x: xBase + 0.3, y: 4.1, w: 3.2, h: 1.3,
      fontSize: 12, fontFace: 'Calibri', color: C.warm700,
      align: 'center', valign: 'top',
    });
  });

  // Context line
  s.addText('Dr. Adonis — PhD research: 87% of employees in a major SA retail study had at least one undiagnosed risk factor.', {
    x: 0.6, y: 5.9, w: 12, h: 0.6,
    fontSize: 11, fontFace: 'Calibri', color: C.sage500,
    italic: true, align: 'left',
  });

  tagline(s);
  bottomBar(s);
  pageNum(s, 2, TOTAL_SLIDES);
}

/** S3 — The Cost to Employers */
function buildSlide3(pptx) {
  const s = pptx.addSlide();
  s.background = { color: C.cream };

  // Top dark band
  s.addShape('rect', { x: 0, y: 0, w: 13.333, h: 2.6, fill: { color: C.sageDark } });
  s.addShape('rect', { x: 0, y: 2.6, w: 13.333, h: 0.06, fill: { color: C.accentGold } });

  // Section label
  s.addText('THE BUSINESS CASE', {
    x: 0.8, y: 0.3, w: 4, h: 0.4,
    fontSize: 10, fontFace: 'Calibri', color: C.sage400,
    bold: true, letterSpacing: 3,
  });

  s.addText('What Poor Health\nCosts Your Business', {
    x: 0.8, y: 0.7, w: 8, h: 1.5,
    fontSize: 32, fontFace: 'Calibri', color: C.white,
    bold: true, align: 'left', lineSpacingMultiple: 1.1,
  });

  // Three stat cards in bottom section
  const bizStats = [
    { num: 'R42B+', label: 'Annual productivity loss\nfrom employee illness', sub: 'in South Africa' },
    { num: '15-20%', label: 'of payroll lost to\nabsenteeism & presenteeism', sub: 'unplanned absence' },
    { num: '3.5x', label: 'ROI on workplace\nwellness programmes', sub: 'per dollar invested' },
  ];

  bizStats.forEach((st, i) => {
    const xBase = 0.8 + i * 4.1;
    s.addShape('roundRect', {
      x: xBase, y: 3.0, w: 3.8, h: 3.2,
      fill: { color: C.white },
      shadow: mkShadow(),
      rectRadius: 0.1,
    });
    s.addShape('rect', {
      x: xBase, y: 3.0, w: 3.8, h: 0.06,
      fill: { color: C.sage500 },
    });
    s.addText(st.num, {
      x: xBase, y: 3.2, w: 3.8, h: 0.8,
      fontSize: 34, fontFace: 'Calibri', color: C.sageDark,
      bold: true, align: 'center', valign: 'middle',
    });
    s.addText(st.label, {
      x: xBase + 0.3, y: 4.0, w: 3.2, h: 1.2,
      fontSize: 13, fontFace: 'Calibri', color: C.warm700,
      bold: true, align: 'center', valign: 'top',
    });
    s.addText(st.sub, {
      x: xBase + 0.3, y: 5.1, w: 3.2, h: 0.6,
      fontSize: 10, fontFace: 'Calibri', color: C.sage400,
      align: 'center', valign: 'top', italic: true,
    });
  });

  // Bottom line
  s.addText('Healthy employees are 2.5x more productive and 40% less likely to leave.', {
    x: 0.8, y: 6.5, w: 11.5, h: 0.4,
    fontSize: 12, fontFace: 'Calibri', color: C.warm700,
    bold: true, align: 'center',
  });

  tagline(s);
  bottomBar(s);
  pageNum(s, 3, TOTAL_SLIDES);
}

/** S4 — The Aliento Solution */
function buildSlide4(pptx) {
  const s = pptx.addSlide();
  s.background = { color: C.cream };

  // Left decorative panel
  s.addShape('rect', { x: 0, y: 0, w: 5.5, h: 7.5, fill: { color: C.sageDark } });

  // Section label
  s.addText('THE SOLUTION', {
    x: 0.6, y: 0.4, w: 4, h: 0.4,
    fontSize: 10, fontFace: 'Calibri', color: C.sage400,
    bold: true, letterSpacing: 3,
  });

  s.addText('Introducing the\nAliento Wellness\nScreening', {
    x: 0.6, y: 0.85, w: 4.3, h: 2.5,
    fontSize: 30, fontFace: 'Calibri', color: C.white,
    bold: true, align: 'left', lineSpacingMultiple: 1.1,
  });

  // Three Pillars right side
  const pillars = [
    { title: 'Screen', desc: 'Comprehensive on-site\nhealth screening for\nall employees', icon: '01' },
    { title: 'Intervene', desc: 'Patient-adapted behavioural\nlifestyle intervention\ntailored to each result', icon: '02' },
    { title: 'Refer', desc: 'Structured onward referral\npathway to trusted\nhealthcare providers', icon: '03' },
  ];

  pillars.forEach((p, i) => {
    const yBase = 1.0 + i * 2.0;
    // Card
    s.addShape('roundRect', {
      x: 6.0, y: yBase, w: 6.8, h: 1.7,
      fill: { color: C.white },
      shadow: mkShadowLight(),
      rectRadius: 0.08,
    });
    // Number circle
    s.addShape('ellipse', {
      x: 6.3, y: yBase + 0.25, w: 0.7, h: 0.7,
      fill: { color: C.sage500 },
    });
    s.addText(p.icon, {
      x: 6.3, y: yBase + 0.25, w: 0.7, h: 0.7,
      fontSize: 14, fontFace: 'Calibri', color: C.white,
      bold: true, align: 'center', valign: 'middle',
    });
    // Pillar title
    s.addText(p.title, {
      x: 7.3, y: yBase + 0.15, w: 5, h: 0.5,
      fontSize: 18, fontFace: 'Calibri', color: C.sageDark,
      bold: true, align: 'left', valign: 'middle',
    });
    // Description
    s.addText(p.desc, {
      x: 7.3, y: yBase + 0.6, w: 5, h: 0.9,
      fontSize: 12, fontFace: 'Calibri', color: C.warm700,
      align: 'left', valign: 'top',
    });
  });

  // R500 highlight on left panel
  s.addShape('roundRect', {
    x: 0.6, y: 4.0, w: 4.3, h: 1.5,
    fill: { color: C.sage500, transparency: 20 },
    rectRadius: 0.1,
    line: { color: C.accentGold, width: 1 },
  });
  s.addText([
    { text: 'R500', options: { fontSize: 38, bold: true, color: C.accentGold } },
    { text: '\nper employee per year', options: { fontSize: 12, color: C.sageLight } },
  ], {
    x: 0.6, y: 4.0, w: 4.3, h: 1.5,
    fontFace: 'Calibri', align: 'center', valign: 'middle',
  });

  tagline(s);
  bottomBar(s);
  pageNum(s, 4, TOTAL_SLIDES);
}

/** S5 — How It Works: Step-by-step flow */
function buildSlide5(pptx) {
  const s = pptx.addSlide();
  s.background = { color: C.cream };

  // Section label
  s.addText('HOW IT WORKS', {
    x: 0.8, y: 0.3, w: 4, h: 0.4,
    fontSize: 10, fontFace: 'Calibri', color: C.sage500,
    bold: true, letterSpacing: 3,
  });

  s.addText('Simple. Scalable. Proven.', {
    x: 0.8, y: 0.75, w: 8, h: 0.8,
    fontSize: 30, fontFace: 'Calibri', color: C.warm900,
    bold: true, align: 'left',
  });

  // Five steps in a zigzag/flow layout
  const steps = [
    { num: '1', label: 'On-site\nScreening', desc: 'Health screening at\nyour premises' },
    { num: '2', label: 'Personalised\nReport', desc: 'Each employee gets\na confidential report' },
    { num: '3', label: 'Behavioural\nIntervention', desc: 'Adapted lifestyle\nprogramme' },
    { num: '4', label: 'Onward\nReferral', desc: 'Connected to pharmacy\n& specialist network' },
    { num: '5', label: 'Follow-up &\nTracking', desc: 'Ongoing monitoring\nof outcomes' },
  ];

  steps.forEach((st, i) => {
    const xBase = 0.5 + i * 2.55;
    const yCard = 2.5;

    // Card
    s.addShape('roundRect', {
      x: xBase, y: yCard, w: 2.3, h: 3.2,
      fill: { color: C.white },
      shadow: mkShadowLight(),
      rectRadius: 0.08,
    });

    // Step number circle at top of card
    s.addShape('ellipse', {
      x: xBase + 0.7, y: yCard + 0.15, w: 0.85, h: 0.85,
      fill: { color: C.sage500 },
    });
    s.addText(st.num, {
      x: xBase + 0.7, y: yCard + 0.15, w: 0.85, h: 0.85,
      fontSize: 20, fontFace: 'Calibri', color: C.white,
      bold: true, align: 'center', valign: 'middle',
    });

    // Label
    s.addText(st.label, {
      x: xBase + 0.1, y: yCard + 1.1, w: 2.1, h: 0.8,
      fontSize: 14, fontFace: 'Calibri', color: C.sageDark,
      bold: true, align: 'center', valign: 'middle',
    });

    // Separator line
    s.addShape('line', {
      x: xBase + 0.3, y: yCard + 1.95, w: 1.7, h: 0,
      line: { color: C.sage400, width: 0.5 },
    });

    // Description
    s.addText(st.desc, {
      x: xBase + 0.15, y: yCard + 2.05, w: 2.0, h: 0.9,
      fontSize: 10, fontFace: 'Calibri', color: C.warm700,
      align: 'center', valign: 'top',
    });

    // Arrow between cards (except last)
    if (i < steps.length - 1) {
      s.addText('→', {
        x: xBase + 2.2, y: yCard + 1.0, w: 0.5, h: 0.6,
        fontSize: 24, fontFace: 'Calibri', color: C.sage400,
        align: 'center', valign: 'middle',
      });
    }
  });

  tagline(s);
  bottomBar(s);
  pageNum(s, 5, TOTAL_SLIDES);
}

/** S6 — R500 Per Employee — Transparent Pricing */
function buildSlide6(pptx) {
  const s = pptx.addSlide();
  s.background = { color: C.cream };

  // Bold accent panel on the right
  s.addShape('rect', { x: 7.5, y: 0, w: 5.833, h: 7.5, fill: { color: C.sageDark } });

  // Section label
  s.addText('PRICING', {
    x: 0.8, y: 0.3, w: 4, h: 0.4,
    fontSize: 10, fontFace: 'Calibri', color: C.sage500,
    bold: true, letterSpacing: 3,
  });

  s.addText('One Price.\nEverything Included.', {
    x: 0.8, y: 0.75, w: 6, h: 1.5,
    fontSize: 32, fontFace: 'Calibri', color: C.warm900,
    bold: true, align: 'left', lineSpacingMultiple: 1.1,
  });

  // Big R500 display on right panel
  s.addText([
    { text: 'R500', options: { fontSize: 56, bold: true, color: C.accentGold } },
    { text: '\nper employee', options: { fontSize: 18, color: C.sageLight } },
    { text: '\nper year', options: { fontSize: 14, color: C.sage400 } },
  ], {
    x: 7.8, y: 1.5, w: 5.0, h: 3.0,
    fontFace: 'Calibri', align: 'center', valign: 'middle',
  });

  // What's included — left side checklist
  const includes = [
    '✓ Comprehensive health screening',
    '✓ Confidential individual reports',
    '✓ Patient-adapted behavioural intervention',
    '✓ Structured onward referral pathway',
    '✓ Multi-disciplinary team coordination',
    '✓ Annual follow-up & progress tracking',
  ];

  includes.forEach((item, i) => {
    s.addText(item, {
      x: 0.8, y: 2.6 + i * 0.5, w: 6, h: 0.45,
      fontSize: 13, fontFace: 'Calibri', color: C.warm700,
      align: 'left', valign: 'middle',
    });
  });

  // EMIs / note on right
  s.addText('Just R42 per month\nper employee', {
    x: 7.8, y: 4.8, w: 5.0, h: 1.0,
    fontSize: 16, fontFace: 'Calibri', color: C.sageLight,
    bold: true, align: 'center', valign: 'middle',
  });

  // Bottom note
  s.addText('Bulk discounts available for 500+ employees. No hidden fees. No lock-in contracts.', {
    x: 0.8, y: 6.3, w: 6, h: 0.5,
    fontSize: 11, fontFace: 'Calibri', color: C.sage500,
    italic: true, align: 'left',
  });

  tagline(s);
  bottomBar(s);
  pageNum(s, 6, TOTAL_SLIDES);
}

/** S7 — Onward Referral Network */
function buildSlide7(pptx) {
  const s = pptx.addSlide();
  s.background = { color: C.cream };

  // Section label
  s.addText('REFERRAL NETWORK', {
    x: 0.8, y: 0.3, w: 4, h: 0.4,
    fontSize: 10, fontFace: 'Calibri', color: C.sage500,
    bold: true, letterSpacing: 3,
  });

  s.addText('Connected to Care', {
    x: 0.8, y: 0.75, w: 8, h: 0.8,
    fontSize: 30, fontFace: 'Calibri', color: C.warm900,
    bold: true, align: 'left',
  });

  // Network: central hub + spokes layout
  // Central hub
  s.addShape('ellipse', {
    x: 5.5, y: 2.5, w: 2.0, h: 2.0,
    fill: { color: C.sageDark },
    shadow: mkShadow(),
  });
  s.addText('Aliento\nMedical', {
    x: 5.5, y: 2.5, w: 2.0, h: 2.0,
    fontSize: 13, fontFace: 'Calibri', color: C.white,
    bold: true, align: 'center', valign: 'middle',
  });

  // Surrounding hubs
  const network = [
    { label: 'Pharmacy\nGroup', x: 1.5, y: 1.8, color: C.sage500 },
    { label: 'General\nPractitioners', x: 2.0, y: 4.8, color: C.sage500 },
    { label: 'Dietitians\n& Nutritionists', x: 8.5, y: 1.8, color: C.sage500 },
    { label: 'Biokineticists\n& Physios', x: 9.5, y: 4.0, color: C.sage500 },
    { label: 'Psychologists\n& Counsellors', x: 7.5, y: 5.5, color: C.sage500 },
  ];

  network.forEach((n) => {
    // Connecting line
    s.addShape('line', {
      x: 5.5 + 1.0, y: 2.5 + 1.0, w: n.x - 5.5 - 0.5, h: n.y - 2.5 - 0.5,
      line: { color: C.sage400, width: 1, dashType: 'dash' },
    });

    // Node
    s.addShape('roundRect', {
      x: n.x, y: n.y, w: 2.0, h: 1.2,
      fill: { color: n.color },
      rectRadius: 0.08,
      shadow: mkShadowLight(),
    });
    s.addText(n.label, {
      x: n.x, y: n.y, w: 2.0, h: 1.2,
      fontSize: 11, fontFace: 'Calibri', color: C.white,
      bold: true, align: 'center', valign: 'middle',
    });
  });

  s.addText('Patient-by-patient referral pathway established with a leading pharmacy group.', {
    x: 0.8, y: 6.5, w: 11.5, h: 0.4,
    fontSize: 12, fontFace: 'Calibri', color: C.warm700,
    italic: true, align: 'center',
  });

  tagline(s);
  bottomBar(s);
  pageNum(s, 7, TOTAL_SLIDES);
}

/** S8 — Why Aliento */
function buildSlide8(pptx) {
  const s = pptx.addSlide();
  s.background = { color: C.cream };

  // Top accent bar
  s.addShape('rect', { x: 0, y: 0, w: 13.333, h: 0.06, fill: { color: C.accentGold } });

  // Section label
  s.addText('WHY ALIENTO', {
    x: 0.8, y: 0.4, w: 4, h: 0.4,
    fontSize: 10, fontFace: 'Calibri', color: C.sage500,
    bold: true, letterSpacing: 3,
  });

  s.addText('Why Aliento?', {
    x: 0.8, y: 0.85, w: 8, h: 0.8,
    fontSize: 30, fontFace: 'Calibri', color: C.warm900,
    bold: true, align: 'left',
  });

  // Two-column layout
  // Left column — about Dr. Adonis
  s.addShape('roundRect', {
    x: 0.8, y: 2.0, w: 5.5, h: 4.5,
    fill: { color: C.white },
    shadow: mkShadow(),
    rectRadius: 0.08,
  });
  s.addShape('rect', {
    x: 0.8, y: 2.0, w: 5.5, h: 0.06,
    fill: { color: C.sageDark },
  });

  s.addText('Dr. Leegale Adonis', {
    x: 1.1, y: 2.2, w: 4.8, h: 0.5,
    fontSize: 18, fontFace: 'Calibri', color: C.sageDark,
    bold: true, align: 'left', valign: 'middle',
  });

  s.addText([
    { text: 'PhD in Public Health', options: { bold: true } },
    { text: '\n• 8+ years clinical practice experience' },
    { text: '\n• Expert in preventative medicine & lifestyle intervention' },
    { text: '\n• Established patient-by-patient referral network' },
    { text: '\n• Proven track record in employee wellness' },
  ], {
    x: 1.1, y: 2.8, w: 4.8, h: 2.5,
    fontSize: 12, fontFace: 'Calibri', color: C.warm700,
    align: 'left', valign: 'top', lineSpacingMultiple: 1.3,
  });

  // Right column — tech-enabled differentiators
  s.addShape('roundRect', {
    x: 6.8, y: 2.0, w: 5.5, h: 4.5,
    fill: { color: C.white },
    shadow: mkShadow(),
    rectRadius: 0.08,
  });
  s.addShape('rect', {
    x: 6.8, y: 2.0, w: 5.5, h: 0.06,
    fill: { color: C.sage500 },
  });

  s.addText('Tech-Enabled Practice', {
    x: 7.1, y: 2.2, w: 4.8, h: 0.5,
    fontSize: 18, fontFace: 'Calibri', color: C.sageDark,
    bold: true, align: 'left', valign: 'middle',
  });

  s.addText([
    { text: '✓ ', options: { color: C.sage500, bold: true } },
    { text: 'Cal.com booking — instant online scheduling\n' },
    { text: '✓ ', options: { color: C.sage500, bold: true } },
    { text: 'Digital health reports & results portal\n' },
    { text: '✓ ', options: { color: C.sage500, bold: true } },
    { text: 'Custom-branded employee wellness portal\n' },
    { text: '✓ ', options: { color: C.sage500, bold: true } },
    { text: 'Data-driven outcomes tracking\n' },
    { text: '✓ ', options: { color: C.sage500, bold: true } },
    { text: 'Scalable from 50 to 50,000 employees' },
  ], {
    x: 7.1, y: 2.9, w: 4.8, h: 2.5,
    fontSize: 12, fontFace: 'Calibri', color: C.warm700,
    align: 'left', valign: 'top', lineSpacingMultiple: 1.5,
  });

  tagline(s);
  bottomBar(s);
  pageNum(s, 8, TOTAL_SLIDES);
}

/** S9 — Call to Action / Start the Conversation */
function buildSlide9(pptx) {
  const s = pptx.addSlide();
  s.background = { color: C.sageDark };

  // Decorative element
  s.addShape('ellipse', {
    x: -2, y: 4, w: 8, h: 8,
    fill: { color: C.sage600, transparency: 70 },
  });
  s.addShape('ellipse', {
    x: 9, y: -2, w: 6, h: 6,
    fill: { color: C.sage500, transparency: 80 },
  });

  // Section label
  s.addText('NEXT STEPS', {
    x: 0.8, y: 0.4, w: 4, h: 0.4,
    fontSize: 10, fontFace: 'Calibri', color: C.sage400,
    bold: true, letterSpacing: 3,
  });

  s.addText("Let's Start the\nConversation", {
    x: 0.8, y: 0.9, w: 8, h: 2.0,
    fontSize: 38, fontFace: 'Calibri', color: C.white,
    bold: true, align: 'left', lineSpacingMultiple: 1.1,
  });

  s.addText('We\'re ready to pilot the Aliento Wellness Screening\nprogramme with your organisation.', {
    x: 0.8, y: 3.0, w: 8, h: 0.9,
    fontSize: 16, fontFace: 'Calibri', color: C.sageLight,
    align: 'left',
  });

  // CTA button
  s.addShape('roundRect', {
    x: 0.8, y: 4.2, w: 4.0, h: 0.75,
    fill: { color: C.accentGold },
    rectRadius: 0.08,
    shadow: mkShadow(),
  });
  s.addText('Book a Meeting →', {
    x: 0.8, y: 4.2, w: 4.0, h: 0.75,
    fontSize: 16, fontFace: 'Calibri', color: C.warm900,
    bold: true, align: 'center', valign: 'middle',
  });

  // Contact details
  s.addText([
    { text: 'Dr. Leegale Adonis\n', options: { fontSize: 14, bold: true, color: C.white } },
    { text: 'Aliento Medical\n', options: { fontSize: 13, color: C.sageLight } },
    { text: 'alientomd.com  |  cal.com/lee-adonis', options: { fontSize: 12, color: C.sage400 } },
  ], {
    x: 0.8, y: 5.2, w: 8, h: 1.5,
    fontFace: 'Calibri', align: 'left', valign: 'top',
    lineSpacingMultiple: 1.4,
  });

  tagline(s);
  bottomBar(s, C.accentGold);
  pageNum(s, 9, TOTAL_SLIDES);
}

/** S10 — Thank You / Contact */
function buildSlide10(pptx) {
  const s = pptx.addSlide();
  s.background = { color: C.cream };

  // Center layout
  // Decorative top bar
  s.addShape('rect', {
    x: 0, y: 0, w: 13.333, h: 0.06,
    fill: { color: C.sageDark },
  });

  // Main message
  s.addText('Breathe.', {
    x: 0, y: 1.2, w: 13.333, h: 0.8,
    fontSize: 40, fontFace: 'Calibri', color: C.sageDark,
    bold: true, align: 'center', valign: 'middle',
  });

  s.addText('Screen.', {
    x: 0, y: 1.9, w: 13.333, h: 0.8,
    fontSize: 40, fontFace: 'Calibri', color: C.sage500,
    bold: true, align: 'center', valign: 'middle',
  });

  s.addText('Live.', {
    x: 0, y: 2.6, w: 13.333, h: 0.8,
    fontSize: 40, fontFace: 'Calibri', color: C.accentGold,
    bold: true, align: 'center', valign: 'middle',
  });

  // Divider
  s.addShape('line', {
    x: 5.0, y: 3.6, w: 3.333, h: 0,
    line: { color: C.sage400, width: 1 },
  });

  // Contact info
  s.addText('Dr. Leegale Adonis', {
    x: 0, y: 3.9, w: 13.333, h: 0.5,
    fontSize: 20, fontFace: 'Calibri', color: C.warm900,
    bold: true, align: 'center', valign: 'middle',
  });

  s.addText('Founder, Aliento Medical', {
    x: 0, y: 4.4, w: 13.333, h: 0.4,
    fontSize: 14, fontFace: 'Calibri', color: C.warm700,
    align: 'center', valign: 'middle',
  });

  // Contact details card
  s.addShape('roundRect', {
    x: 3.5, y: 5.0, w: 6.333, h: 1.5,
    fill: { color: C.white },
    shadow: mkShadowLight(),
    rectRadius: 0.08,
  });
  s.addShape('rect', {
    x: 3.5, y: 5.0, w: 6.333, h: 0.06,
    fill: { color: C.sage500 },
  });

  s.addText([
    { text: 'alientomd.com\n', options: { fontSize: 14, color: C.sageDark, bold: true } },
    { text: 'cal.com/lee-adonis  |  info@alientomd.com', options: { fontSize: 11, color: C.warm700 } },
  ], {
    x: 3.8, y: 5.15, w: 5.733, h: 1.2,
    fontFace: 'Calibri', align: 'center', valign: 'middle',
    lineSpacingMultiple: 1.4,
  });

  tagline(s);
  bottomBar(s);
  pageNum(s, 10, TOTAL_SLIDES);
}

// ── Main Builder ───────────────────────────────────────────────────────────

function buildDeck() {
  const pptx = new PptxGenJS();

  // Widescreen 16:9
  pptx.defineLayout({ name: 'CUSTOM', width: 13.333, height: 7.5 });
  pptx.layout = 'CUSTOM';

  // Set document metadata
  pptx.author = 'Aliento Medical — Dr. Leegale Adonis';
  pptx.title = 'Aliento Employee Wellness Screening';
  pptx.subject = 'Employee Wellness Pitch — Big SA Franchises';

  // Build all slides
  buildSlide1(pptx);
  buildSlide2(pptx);
  buildSlide3(pptx);
  buildSlide4(pptx);
  buildSlide5(pptx);
  buildSlide6(pptx);
  buildSlide7(pptx);
  buildSlide8(pptx);
  buildSlide9(pptx);
  buildSlide10(pptx);

  return pptx;
}

// ── Execute ────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌿 Aliento Wellness Pitch Deck Generator');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Target: ${TOTAL_SLIDES} slides`);

  const deck = buildDeck();

  console.log('✓ Deck built — generating .pptx file...');

  await deck.writeFile({ fileName: OUTPUT_PATH });

  const fs = require('fs');
  const stats = fs.statSync(OUTPUT_PATH);
  const sizeKB = (stats.size / 1024).toFixed(1);

  console.log(`✓ File written: ${OUTPUT_PATH}`);
  console.log(`✓ Size: ${sizeKB} KB`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Done. Ready for visual verification.');
}

main().catch(err => {
  console.error('✗ Error:', err.message);
  process.exit(1);
});
