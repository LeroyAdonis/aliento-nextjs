const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Dr. Leegale Adonis — Aliento Health";
pres.title = "Aliento Employer Wellness Pitch";

// ── Brand Colors ──
const SAGE = "5E8A70";
const SAGE_DARK = "4A7059";
const SAGE_LIGHT = "8FBD9F";
const SAGE_PALE = "D8EAE0";
const SAGE_BG = "EEF5F0";
const WARM = "433E34";
const WARM_DARK = "2E2A26";
const WARM_MUTED = "857A6A";
const CREAM = "FDF8F0";
const CREAM_DARK = "FAF1E2";
const BLUSH = "E09090";
const BLUSH_LIGHT = "FDF5F5";
const WHITE = "FFFFFF";
const OFF_WHITE = "F3F1ED";

// ── Helpers ──
const mkShadow = () => ({ type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.08 });

function sageBar(slide, y) {
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: y, w: 10, h: 0.06, fill: { color: SAGE_LIGHT } });
}

function pageNum(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 8.5, y: 5.15, w: 1.2, h: 0.3,
    fontSize: 8, color: WARM_MUTED, align: "right", fontFace: "Calibri"
  });
}

const TOTAL_SLIDES = 10;

// ═══════════════════════════════════════════
// SLIDE 1 — TITLE
// ═══════════════════════════════════════════
let s1 = pres.addSlide();
s1.background = { color: SAGE };

// Decorative circles
s1.addShape(pres.shapes.OVAL, { x: -1.5, y: -1.5, w: 4, h: 4, fill: { color: SAGE_DARK, transparency: 60 } });
s1.addShape(pres.shapes.OVAL, { x: 7.5, y: 3.5, w: 3.5, h: 3.5, fill: { color: SAGE_DARK, transparency: 50 } });
s1.addShape(pres.shapes.OVAL, { x: 8.5, y: -0.5, w: 2, h: 2, fill: { color: SAGE_LIGHT, transparency: 70 } });

// Tagline
s1.addText("ALIENTO HEALTH", {
  x: 0.8, y: 0.6, w: 4, h: 0.4,
  fontSize: 10, color: SAGE_PALE, fontFace: "Calibri", bold: true, charSpacing: 4
});

// Main title
s1.addText("Employer Wellness\nThat Actually Works", {
  x: 0.8, y: 1.3, w: 7.5, h: 2,
  fontSize: 38, color: WHITE, fontFace: "Georgia", bold: true,
  paraSpaceAfter: 8
});

// Subtitle
s1.addText("Give your team access to a real doctor — for less than\nthe cost of a sandwich per person per month.", {
  x: 0.8, y: 3.2, w: 7, h: 0.9,
  fontSize: 16, color: SAGE_PALE, fontFace: "Calibri"
});

// Price callout — dark block with white text for readability
s1.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.2, w: 3, h: 0.7, fill: { color: SAGE_DARK } });
s1.addText([
  { text: "R200", options: { bold: true, fontSize: 22, color: WHITE } },
  { text: " / employee / month", options: { fontSize: 13, color: SAGE_PALE } }
], { x: 0.8, y: 4.2, w: 3, h: 0.7, align: "center", valign: "middle" });

// Footer
s1.addText("Dr. Leegale Adonis  •  alientomd.com  •  info@alientomd.com", {
  x: 0.8, y: 5.1, w: 8, h: 0.3,
  fontSize: 9, color: SAGE_PALE, fontFace: "Calibri"
});

// ═══════════════════════════════════════════
// SLIDE 2 — THE PROBLEM
// ═══════════════════════════════════════════
let s2 = pres.addSlide();
s2.background = { color: CREAM };

// Decorative circles
s2.addShape(pres.shapes.OVAL, { x: -1, y: -0.5, w: 3, h: 3, fill: { color: SAGE_PALE, transparency: 60 } });
s2.addShape(pres.shapes.OVAL, { x: 7.8, y: 3.8, w: 2.5, h: 2.5, fill: { color: BLUSH_LIGHT, transparency: 30 } });

s2.addText("THE PROBLEM", { x: 0.8, y: 0.4, w: 4, h: 0.4, fontSize: 10, color: SAGE, fontFace: "Calibri", bold: true, charSpacing: 4 });

s2.addText("The Millions In Between", {
  x: 0.8, y: 0.9, w: 8, h: 0.7,
  fontSize: 32, color: WARM_DARK, fontFace: "Georgia", bold: true
});

sageBar(s2, 1.65);

// Three problem cards
const problems = [
  { stat: "3.84M", desc: "South Africans pay for\nhealthcare out-of-pocket", color: SAGE },
  { stat: "R1,500+", desc: "Average medical aid\ncost per employee/month", color: WARM_MUTED },
  { stat: "80%", desc: "Skip preventive care —\nonly visit when already sick", color: BLUSH }
];

problems.forEach((p, i) => {
  const x = 0.8 + i * 3.1;
  s2.addShape(pres.shapes.RECTANGLE, { x, y: 2.1, w: 2.7, h: 2.6, fill: { color: WHITE }, shadow: mkShadow() });
  // Top accent bar
  s2.addShape(pres.shapes.RECTANGLE, { x, y: 2.1, w: 2.7, h: 0.08, fill: { color: p.color } });
  s2.addText(p.stat, { x, y: 2.4, w: 2.7, h: 0.8, fontSize: 36, color: p.color, fontFace: "Georgia", bold: true, align: "center" });
  s2.addText(p.desc, { x, y: 3.3, w: 2.7, h: 1, fontSize: 11, color: WARM, align: "center", fontFace: "Calibri" });
});

s2.addText("Medical aid is unaffordable. Government clinics are overcrowded. Your employees fall through the cracks.", {
  x: 0.8, y: 4.9, w: 8, h: 0.4,
  fontSize: 11, color: WARM_MUTED, fontFace: "Calibri", italic: true, align: "center"
});

pageNum(s2, 2, TOTAL_SLIDES);

// ═══════════════════════════════════════════
// SLIDE 3 — THE SOLUTION
// ═══════════════════════════════════════════
let s3 = pres.addSlide();
s3.background = { color: CREAM };

s3.addShape(pres.shapes.OVAL, { x: -1, y: 4, w: 3.5, h: 3.5, fill: { color: SAGE_PALE, transparency: 65 } });
s3.addShape(pres.shapes.OVAL, { x: 7.5, y: -0.5, w: 3, h: 3, fill: { color: BLUSH_LIGHT, transparency: 25 } });

s3.addText("THE SOLUTION", { x: 0.8, y: 0.4, w: 4, h: 0.4, fontSize: 10, color: SAGE, fontFace: "Calibri", bold: true, charSpacing: 4 });
s3.addText("Aliento Employer Wellness", {
  x: 0.8, y: 0.9, w: 8, h: 0.7,
  fontSize: 32, color: WARM_DARK, fontFace: "Georgia", bold: true
});
sageBar(s3, 1.65);

// Package details — two columns
// Left: description
s3.addText("For just R200 per employee per month, your team gets:", {
  x: 0.8, y: 2.0, w: 4.2, h: 0.4,
  fontSize: 14, color: WARM, fontFace: "Calibri"
});

const features = [
  { icon: "✓", text: "1 virtual consultation per month (R250 value)" },
  { icon: "✓", text: "Unlimited access to health content library" },
  { icon: "✓", text: "Screening reminders — BP, glucose, pap smear" },
  { icon: "✓", text: "Quarterly wellness newsletter for your team" },
  { icon: "✓", text: "Direct WhatsApp access to health guidance" },
  { icon: "✓", text: "No medical aid, no paperwork, no queues" }
];

features.forEach((f, i) => {
  const y = 2.55 + i * 0.4;
  // Green check circle
  s3.addShape(pres.shapes.OVAL, { x: 0.8, y: y + 0.05, w: 0.22, h: 0.22, fill: { color: SAGE } });
  s3.addText(f.text, { x: 1.2, y: y, w: 4, h: 0.35, fontSize: 11, color: WARM, fontFace: "Calibri", valign: "middle" });
});

// Right side: Price highlight card
s3.addShape(pres.shapes.RECTANGLE, { x: 5.8, y: 2.0, w: 3.5, h: 2.8, fill: { color: SAGE_BG }, shadow: mkShadow() });
s3.addText("R200", { x: 5.8, y: 2.2, w: 3.5, h: 0.8, fontSize: 42, color: SAGE, fontFace: "Georgia", bold: true, align: "center" });
s3.addText("per employee\nper month", { x: 5.8, y: 3.0, w: 3.5, h: 0.6, fontSize: 13, color: WARM_MUTED, align: "center", fontFace: "Calibri" });
s3.addText("R2,400/yr vs R18,000+\nmedical aid premium", { x: 5.8, y: 3.7, w: 3.5, h: 0.5, fontSize: 10, color: SAGE_DARK, align: "center", fontFace: "Calibri", italic: true });

// Bottom tagline
s3.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.9, w: 8.4, h: 0.55, fill: { color: SAGE_DARK } });
s3.addText("A knowledgeable friend who happens to be a doctor — for your whole team.", {
  x: 0.8, y: 4.9, w: 8.4, h: 0.55,
  fontSize: 13, color: WHITE, align: "center", valign: "middle", fontFace: "Calibri", italic: true
});

pageNum(s3, 3, TOTAL_SLIDES);

// ═══════════════════════════════════════════
// SLIDE 4 — HOW IT WORKS
// ═══════════════════════════════════════════
let s4 = pres.addSlide();
s4.background = { color: CREAM };

s4.addText("HOW IT WORKS", { x: 0.8, y: 0.4, w: 4, h: 0.4, fontSize: 10, color: SAGE, fontFace: "Calibri", bold: true, charSpacing: 4 });
s4.addText("Simple. No paperwork. No queues.", {
  x: 0.8, y: 0.9, w: 8, h: 0.7,
  fontSize: 32, color: WARM_DARK, fontFace: "Georgia", bold: true
});
sageBar(s4, 1.65);

const steps = [
  { num: "1", title: "You Sign Up", desc: "Choose your team size.\nWe set up your company\nportal in under an hour.", color: SAGE },
  { num: "2", title: "Employees Register", desc: "Each employee gets a\npersonal profile. No\ncomplex onboarding.", color: SAGE_LIGHT },
  { num: "3", title: "Monthly Consults", desc: "Employees book 15-20 min\nvirtual consults with\ndr. Leegale Adonis.", color: WARM_MUTED },
  { num: "4", title: "We Track & Report", desc: "Quarterly wellness reports.\nScreening reminders.\nHealth tips for your team.", color: BLUSH }
];

steps.forEach((st, i) => {
  const x = 0.5 + i * 2.35;
  
  // Number circle
  s4.addShape(pres.shapes.OVAL, { x: x + 0.75, y: 2.0, w: 0.7, h: 0.7, fill: { color: st.color } });
  s4.addText(st.num, { x: x + 0.75, y: 2.0, w: 0.7, h: 0.7, fontSize: 18, color: WHITE, align: "center", valign: "middle", fontFace: "Georgia", bold: true });
  
  // Title
  s4.addText(st.title, { x, y: 2.9, w: 2.2, h: 0.4, fontSize: 14, color: WARM_DARK, align: "center", fontFace: "Georgia", bold: true });
  
  // Description
  s4.addText(st.desc, { x, y: 3.35, w: 2.2, h: 1.1, fontSize: 11, color: WARM, align: "center", fontFace: "Calibri" });
  
  // Arrow between steps (except last)
  if (i < 3) {
    s4.addText("→", { x: x + 2.05, y: 2.1, w: 0.4, h: 0.5, fontSize: 18, color: SAGE_LIGHT, align: "center", fontFace: "Calibri" });
  }
});

pageNum(s4, 4, TOTAL_SLIDES);

// ═══════════════════════════════════════════
// SLIDE 5 — WHY EMPLOYERS WIN
// ═══════════════════════════════════════════
let s5 = pres.addSlide();
s5.background = { color: SAGE };

s5.addShape(pres.shapes.OVAL, { x: -1, y: -0.5, w: 3, h: 3, fill: { color: SAGE_DARK, transparency: 60 } });
s5.addShape(pres.shapes.OVAL, { x: 7, y: 3.5, w: 4, h: 4, fill: { color: SAGE_DARK, transparency: 55 } });

s5.addText("WHY EMPLOYERS WIN", { x: 0.8, y: 0.4, w: 4, h: 0.4, fontSize: 10, color: SAGE_PALE, fontFace: "Calibri", bold: true, charSpacing: 4 });
s5.addText("Invest R200, Get Back\nMuch More", {
  x: 0.8, y: 0.9, w: 8, h: 1.2,
  fontSize: 32, color: WHITE, fontFace: "Georgia", bold: true
});

const wins = [
  { stat: "↑", label: "Employee Retention", desc: "Healthcare benefits are\na top-3 retention driver\nfor SA employees" },
  { stat: "↓", label: "Absenteeism", desc: "Preventive care catches\nissues early — fewer\nsick days" },
  { stat: "★", label: "Differentiation", desc: "Stand out as an employer\nthat actually cares\nabout their people" }
];

wins.forEach((w, i) => {
  const x = 0.5 + i * 3.2;
  s5.addShape(pres.shapes.RECTANGLE, { x, y: 2.4, w: 2.8, h: 2.8, fill: { color: WHITE, transparency: 10 } });
  
  s5.addText(w.stat, { x, y: 2.6, w: 2.8, h: 0.6, fontSize: 28, color: SAGE, align: "center", fontFace: "Georgia" });
  s5.addText(w.label, { x, y: 3.2, w: 2.8, h: 0.4, fontSize: 14, color: WARM_DARK, align: "center", fontFace: "Georgia", bold: true });
  s5.addText(w.desc, { x, y: 3.65, w: 2.8, h: 1, fontSize: 11, color: WARM, align: "center", fontFace: "Calibri" });
});

pageNum(s5, 5, TOTAL_SLIDES);

// ═══════════════════════════════════════════
// SLIDE 6 — TARGET EMPLOYERS
// ═══════════════════════════════════════════
let s6 = pres.addSlide();
s6.background = { color: CREAM };

s6.addShape(pres.shapes.OVAL, { x: 8, y: -0.5, w: 3, h: 3, fill: { color: SAGE_PALE, transparency: 55 } });

s6.addText("WHO WE'RE TARGETING", { x: 0.8, y: 0.4, w: 4, h: 0.4, fontSize: 10, color: SAGE, fontFace: "Calibri", bold: true, charSpacing: 4 });
s6.addText("Start With These Employers", {
  x: 0.8, y: 0.9, w: 8, h: 0.7,
  fontSize: 32, color: WARM_DARK, fontFace: "Georgia", bold: true
});
sageBar(s6, 1.65);

const targets = [
  { name: "Cleaning Services", example: "SweepSouth, Tsebo", priority: "HIGH", emp: "500–5,000" },
  { name: "Security", example: "Fidelity, ADT", priority: "HIGH", emp: "1,000–10,000" },
  { name: "Hospitality", example: "VIDA, Burger King", priority: "HIGH", emp: "50–500" },
  { name: "Construction", example: "Mid-size firms", priority: "HIGH", emp: "20–200" },
  { name: "Farming / Packhouses", example: "Farms, agri-processing", priority: "VERY HIGH", emp: "50–1,000" },
  { name: "Retail", example: "Checkers, Shoprite", priority: "MEDIUM", emp: "1,000–20,000" },
  { name: "NGOs", example: "Community organisations", priority: "MEDIUM", emp: "10–100" }
];

// Table header
const headerOpts = { fill: { color: SAGE }, color: WHITE, bold: true, fontSize: 11, fontFace: "Calibri", align: "center", valign: "middle" };
const cellOpts = { fontSize: 11, color: WARM, fontFace: "Calibri", valign: "middle" };
const prioHigh = { color: SAGE_DARK, bold: true, fontSize: 11, fontFace: "Calibri", valign: "middle", align: "center" };
const prioVeryHigh = { color: BLUSH, bold: true, fontSize: 11, fontFace: "Calibri", valign: "middle", align: "center" };

const headerRow = [
  { text: "SECTOR", options: headerOpts },
  { text: "EXAMPLES", options: headerOpts },
  { text: "PRIORITY", options: headerOpts },
  { text: "EMPLOYEES", options: headerOpts }
];

const dataRows = targets.map(t => [
  { text: t.name, options: cellOpts },
  { text: t.example, options: { ...cellOpts, color: WARM_MUTED } },
  { text: t.priority, options: t.priority === "VERY HIGH" ? prioVeryHigh : prioHigh },
  { text: t.emp, options: { ...cellOpts, align: "center" } }
]);

s6.addTable([headerRow, ...dataRows], {
  x: 0.8, y: 2.0, w: 8.4,
  colW: [2.5, 2.5, 1.5, 1.5],
  rowH: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
  border: { pt: 0.5, color: SAGE_PALE },
  autoPage: false
});

s6.addText("Pilot phase: 5 companies → free 1-month trial (10 employees each) → case study → scale to 50.", {
  x: 0.8, y: 5.0, w: 8, h: 0.4,
  fontSize: 11, color: WARM_MUTED, italic: true, fontFace: "Calibri"
});

pageNum(s6, 6, TOTAL_SLIDES);

// ═══════════════════════════════════════════
// SLIDE 7 — PRICING COMPARISON
// ═══════════════════════════════════════════
let s7 = pres.addSlide();
s7.background = { color: CREAM };

s7.addText("THE COST COMPARISON", { x: 0.8, y: 0.4, w: 4, h: 0.4, fontSize: 10, color: SAGE, fontFace: "Calibri", bold: true, charSpacing: 4 });
s7.addText("No Competition. Just Common Sense.", {
  x: 0.8, y: 0.9, w: 8, h: 0.7,
  fontSize: 32, color: WARM_DARK, fontFace: "Georgia", bold: true
});
sageBar(s7, 1.65);

// Comparison cards
const compareData = [
  { label: "Medical Aid", cost: "R1,500+", per: "per employee/mo", note: "Waiting periods + paperwork", color: WARM_MUTED, bg: WHITE },
  { label: "Gap Cover", cost: "R350+", per: "per employee/mo", note: "Only hospital, no GP access", color: BLUSH, bg: WHITE },
  { label: "ALIENTO", cost: "R200", per: "per employee/mo", note: "Full GP access • No waiting • No paperwork", color: SAGE, bg: SAGE_BG }
];

compareData.forEach((c, i) => {
  const x = 0.5 + i * 3.2;
  s7.addShape(pres.shapes.RECTANGLE, { x, y: 2.0, w: 2.9, h: 3.2, fill: { color: c.bg }, shadow: mkShadow() });
  // Top color strip
  s7.addShape(pres.shapes.RECTANGLE, { x, y: 2.0, w: 2.9, h: 0.08, fill: { color: c.color } });
  
  s7.addText(c.label, { x, y: 2.2, w: 2.9, h: 0.4, fontSize: 11, color: c.color, align: "center", fontFace: "Calibri", bold: true, charSpacing: 2 });
  s7.addText(c.cost, { x, y: 2.7, w: 2.9, h: 0.7, fontSize: 36, color: WARM_DARK, align: "center", fontFace: "Georgia", bold: true });
  s7.addText(c.per, { x, y: 3.4, w: 2.9, h: 0.3, fontSize: 10, color: WARM_MUTED, align: "center", fontFace: "Calibri" });
  s7.addText(c.note, { x, y: 3.8, w: 2.9, h: 0.6, fontSize: 10, color: WARM_MUTED, align: "center", fontFace: "Calibri" });
});

// Savings callout
s7.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: 4.5, w: 7, h: 0.7, fill: { color: SAGE_DARK } });
s7.addText("R200/mo vs R1,500+ for medical aid. Save R1,300+/employee/month — 87% less.", {
  x: 1.5, y: 4.5, w: 7, h: 0.7,
  fontSize: 14, color: WHITE, align: "center", valign: "middle", fontFace: "Calibri", bold: true
});

pageNum(s7, 7, TOTAL_SLIDES);

// ═══════════════════════════════════════════
// SLIDE 8 — DISCOVERY PARTNERSHIP STRATEGY
// ═══════════════════════════════════════════
let s7b = pres.addSlide();
s7b.background = { color: CREAM };

s7b.addShape(pres.shapes.OVAL, { x: -1, y: 4, w: 4, h: 4, fill: { color: SAGE_PALE, transparency: 55 } });
s7b.addShape(pres.shapes.OVAL, { x: 8, y: -0.5, w: 2.5, h: 2.5, fill: { color: BLUSH_LIGHT, transparency: 25 } });

s7b.addText("STRATEGIC OPPORTUNITY", { x: 0.8, y: 0.4, w: 5, h: 0.4, fontSize: 10, color: SAGE, fontFace: "Calibri", bold: true, charSpacing: 4 });
s7b.addText("Beyond Competition:\nPartner With Discovery", {
  x: 0.8, y: 0.9, w: 8, h: 1.2,
  fontSize: 32, color: WARM_DARK, fontFace: "Georgia", bold: true
});
sageBar(s7b, 2.1);

// Left column: Discovery context
s7b.addText("Discovery's Flexi Plan (R599/mo)", {
  x: 0.8, y: 2.4, w: 4.2, h: 0.4,
  fontSize: 15, color: WARM_DARK, fontFace: "Georgia", bold: true
});

s7b.addText([
  { text: "• ", options: { color: SAGE } },
  { text: "A great product — R599/mo for hospital cover + day-to-day benefits", options: { breakLine: true } },
  { text: "• ", options: { color: SAGE } },
  { text: "But for SMEs: 20 employees × R599 = R11,980/mo — out of reach", options: { breakLine: true } },
  { text: "• ", options: { color: SAGE } },
  { text: "Aliento at R200/emp/mo is complementary, not competitive", options: { breakLine: true } },
  { text: "• ", options: { color: SAGE } },
  { text: "SMEs: Aliento for GP access + Discovery for hospital = complete care", options: {} }
], { x: 0.8, y: 2.9, w: 4.2, h: 1.8, fontSize: 11, color: WARM, fontFace: "Calibri", valign: "top", paraSpaceAfter: 6 });

// Right column: Partnership model
s7b.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 2.4, w: 4, h: 2.2, fill: { color: SAGE_BG }, shadow: mkShadow() });

s7b.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 2.4, w: 4, h: 0.08, fill: { color: SAGE } });
s7b.addText("THE REAL PLAY", {
  x: 5.5, y: 2.55, w: 4, h: 0.3,
  fontSize: 12, color: SAGE, fontFace: "Georgia", bold: true, align: "center", charSpacing: 2
});

s7b.addText("Pitch Aliento as a\nDiscovery Service Provider", {
  x: 5.5, y: 2.9, w: 4, h: 0.55,
  fontSize: 16, color: WARM_DARK, fontFace: "Georgia", bold: true, align: "center"
});

const partnerBenefits = [
  "Aliento GP as Flexi add-on",
  "GP layer (us) + hospital (Discovery)",
  "Revenue share or per-consult",
  "Access to 1M+ Flexi members"
];

partnerBenefits.forEach((b, i) => {
  const y = 3.55 + i * 0.26;
  s7b.addShape(pres.shapes.OVAL, { x: 5.8, y: y + 0.03, w: 0.14, h: 0.14, fill: { color: SAGE } });
  s7b.addText(b, { x: 6.05, y: y, w: 3.2, h: 0.26, fontSize: 9, color: WARM, fontFace: "Calibri" });
});

// Bottom two-track callout
s7b.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.7, w: 8.4, h: 0.5, fill: { color: WARM_DARK } });
s7b.addText("Two-track strategy: ① Direct-to-SME (R200/emp/mo)  •  ② Discovery partnership (scale to millions)", {
  x: 0.8, y: 4.7, w: 8.4, h: 0.5,
  fontSize: 11, color: WHITE, align: "center", valign: "middle", fontFace: "Calibri", bold: true
});

pageNum(s7b, 8, TOTAL_SLIDES);

// ═══════════════════════════════════════════
// SLIDE 9 — PILOT OFFER
// ═══════════════════════════════════════════
let s8 = pres.addSlide();
s8.background = { color: SAGE };

s8.addShape(pres.shapes.OVAL, { x: -1.5, y: 4, w: 5, h: 5, fill: { color: SAGE_DARK, transparency: 60 } });
s8.addShape(pres.shapes.OVAL, { x: 7, y: -1, w: 4, h: 4, fill: { color: SAGE_LIGHT, transparency: 75 } });

s8.addText("PILOT OFFER", { x: 0.8, y: 0.4, w: 4, h: 0.4, fontSize: 10, color: SAGE_PALE, fontFace: "Calibri", bold: true, charSpacing: 4 });
s8.addText("Try It Free For\nOne Month", {
  x: 0.8, y: 0.9, w: 8, h: 1.5,
  fontSize: 38, color: WHITE, fontFace: "Georgia", bold: true
});

s8.addText("We're looking for 5 companies to pilot Aliento Employer Wellness.", {
  x: 0.8, y: 2.5, w: 7, h: 0.4,
  fontSize: 16, color: SAGE_PALE, fontFace: "Calibri"
});

const pilotDetails = [
  "Free 1-month trial for up to 10 employees",
  "Full access to virtual consultations",
  "We handle onboarding and setup",
  "Quarterly wellness report included",
  "Zero commitment — cancel anytime"
];

pilotDetails.forEach((d, i) => {
  const y = 3.15 + i * 0.42;
  s8.addShape(pres.shapes.OVAL, { x: 0.8, y: y + 0.08, w: 0.2, h: 0.2, fill: { color: SAGE_LIGHT } });
  s8.addText(d, { x: 1.2, y: y, w: 7, h: 0.35, fontSize: 13, color: WHITE, fontFace: "Calibri", valign: "middle" });
});

// CTA — moved to the right to avoid overlapping text
s8.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 4.5, w: 3.5, h: 0.65, fill: { color: WHITE } });
s8.addText("BOOK A 10-MIN CALL", {
  x: 5.5, y: 4.5, w: 3.5, h: 0.65,
  fontSize: 12, color: SAGE, align: "center", valign: "middle", fontFace: "Calibri", bold: true, charSpacing: 2
});

pageNum(s8, 9, TOTAL_SLIDES);

// ═══════════════════════════════════════════
// SLIDE 10 — CONTACT / CLOSING
// ═══════════════════════════════════════════
let s9 = pres.addSlide();
s9.background = { color: WARM_DARK };

s9.addShape(pres.shapes.OVAL, { x: -1, y: -1, w: 4, h: 4, fill: { color: SAGE_DARK, transparency: 60 } });
s9.addShape(pres.shapes.OVAL, { x: 6.5, y: 3, w: 4.5, h: 4.5, fill: { color: SAGE_DARK, transparency: 55 } });

s9.addText("Let's Talk", {
  x: 0.8, y: 1.2, w: 8, h: 1,
  fontSize: 40, color: WHITE, fontFace: "Georgia", bold: true
});

s9.addText("Every employee deserves access to a real doctor.\nLet's make it happen for your team.", {
  x: 0.8, y: 2.2, w: 7, h: 0.8,
  fontSize: 16, color: SAGE_PALE, fontFace: "Calibri"
});

// Contact card — dark card with white text for readability
s9.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.2, w: 5, h: 1.5, fill: { color: SAGE_DARK } });
s9.addText("Dr. Leegale Adonis", {
  x: 1.2, y: 3.3, w: 4.2, h: 0.4,
  fontSize: 14, color: WHITE, fontFace: "Georgia", bold: true
});
s9.addText("MBBCH, MBA, FCPHM (SA), MMed, Comm Health, PhD", {
  x: 1.2, y: 3.7, w: 4.2, h: 0.3,
  fontSize: 9, color: SAGE_PALE, fontFace: "Calibri"
});
s9.addText("info@alientomd.com  •  alientomd.com", {
  x: 1.2, y: 4.1, w: 4.2, h: 0.3,
  fontSize: 11, color: WHITE, fontFace: "Calibri"
});

// Tagline
s9.addText("Breathe, Screen, Live  🌿", {
  x: 0.8, y: 5.0, w: 8, h: 0.4,
  fontSize: 12, color: SAGE_PALE, fontFace: "Georgia", italic: true
});

pageNum(s9, 10, TOTAL_SLIDES);

// ═══════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════
const outputPath = "/root/aliento-nextjs/public/pdfs/Aliento_Employer_Wellness_Pitch.pptx";

pres.writeFile({ fileName: outputPath })
  .then(() => console.log(`✓ Created: ${outputPath}`))
  .catch(err => console.error("Error:", err));
