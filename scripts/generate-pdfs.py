#!/usr/bin/env python3
"""
Generate PREMIUM Aliento-branded health guide PDFs.
Features the site's organic blob decorations, pastel colors, premium layout.
"""

import os, math, random
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black, Color
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Path, Circle, Group
from reportlab.graphics import renderPDF

# ── Current Brand Colors ──
SAGE_50  = HexColor('#EEF5F0')
SAGE_100 = HexColor('#D8EAE0')
SAGE_200 = HexColor('#B8D5C4')
SAGE_300 = HexColor('#8FBD9F')
SAGE_400 = HexColor('#7C9E8A')
SAGE_500 = HexColor('#5E8A70')
SAGE_600 = HexColor('#4A7059')
SAGE_700 = HexColor('#3A5746')
WARM_50  = HexColor('#FAF9F7')
WARM_100 = HexColor('#F3F1ED')
WARM_200 = HexColor('#E5E1DB')
WARM_300 = HexColor('#CCC6BC')
WARM_400 = HexColor('#A89F91')
WARM_500 = HexColor('#857A6A')
WARM_600 = HexColor('#635B4E')
WARM_700 = HexColor('#433E34')
WARM_800 = HexColor('#29251E')
WARM_900 = HexColor('#2E2A26')
CREAM_50  = HexColor('#FEFCF8')
CREAM_100 = HexColor('#FDF8F0')
CREAM_200 = HexColor('#FAF1E2')
CREAM_300 = HexColor('#F5E6CA')
BLUSH_50  = HexColor('#FDF5F5')
BLUSH_100 = HexColor('#FAEAEA')
BLUSH_200 = HexColor('#F5D0D0')

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'pdfs')
os.makedirs(OUTPUT_DIR, exist_ok=True)

PAGE_W, PAGE_H = A4

# ── Styles ──
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'GuideTitle', parent=styles['Heading1'],
    fontName='Helvetica-Bold', fontSize=28, leading=34,
    textColor=WARM_900, alignment=TA_LEFT, spaceAfter=6,
)
subtitle_style = ParagraphStyle(
    'GuideSubtitle', parent=styles['Normal'],
    fontName='Helvetica', fontSize=14, leading=20,
    textColor=WARM_500, alignment=TA_LEFT, spaceAfter=24,
)
h2_style = ParagraphStyle(
    'GuideH2', parent=styles['Heading2'],
    fontName='Helvetica-Bold', fontSize=18, leading=24,
    textColor=SAGE_600, spaceBefore=28, spaceAfter=12,
)
h3_style = ParagraphStyle(
    'GuideH3', parent=styles['Heading3'],
    fontName='Helvetica-Bold', fontSize=14, leading=18,
    textColor=SAGE_400, spaceBefore=20, spaceAfter=8,
)
body_style = ParagraphStyle(
    'GuideBody', parent=styles['Normal'],
    fontName='Helvetica', fontSize=11, leading=17,
    textColor=WARM_700, alignment=TA_JUSTIFY, spaceAfter=10,
)
bullet_style = ParagraphStyle(
    'GuideBullet', parent=body_style,
    leftIndent=24, bulletIndent=10, spaceAfter=5, leading=16,
)

# ── Drawing Helpers ──

def organic_blob(cx, cy, w, h, color, opacity=0.15):
    """Create an organic blob shape (60% 40% 55% 45% / 45% 55% 40% 60%)."""
    d = Drawing(w, h)
    p = Path()
    rw, rh = w, h
    # Approximate the organic-blob border-radius using bezier curves
    # Top-left area
    p.moveTo(rw*0.05, rh*0.4)
    p.curveTo(rw*0.02, rh*0.25, rw*0.1, rh*0.05, rw*0.35, rh*0.05)
    # Top-right
    p.curveTo(rw*0.55, rh*0.05, rw*0.7, rh*0.08, rw*0.85, rh*0.25)
    # Bottom-right
    p.curveTo(rw*0.95, rh*0.35, rw*0.95, rh*0.6, rw*0.8, rh*0.8)
    # Bottom-left
    p.curveTo(rw*0.7, rh*0.95, rw*0.4, rh*0.95, rw*0.2, rh*0.8)
    p.curveTo(rw*0.08, rh*0.7, rw*0.05, rh*0.55, rw*0.05, rh*0.4)
    p.close()
    
    # Convert hex color to RGBA with opacity
    r = int(color[1:3], 16) / 255
    g = int(color[3:5], 16) / 255
    b = int(color[5:7], 16) / 255
    d.add(p)
    
    # We set fill color via the element properties
    # Since we can't set opacity directly on a Path in reportlab's canvas,
    # we'll use a colored rectangle approach instead
    return None

def pastel_circle(cx, cy, radius, color, opacity=0.12):
    """Create a soft pastel circle."""
    d = Drawing(radius*2, radius*2)
    c = Circle(radius, radius, radius)
    r = int(color[1:3], 16) / 255
    g = int(color[3:5], 16) / 255
    b = int(color[5:7], 16) / 255
    c.fillColor = Color(r, g, b, alpha=opacity)
    c.strokeColor = None
    d.add(c)
    return d

def rounded_rect_block(w, h, fill_color, border_color=None, radius=4*mm):
    """Create a rounded rectangle block."""
    d = Drawing(w, h)
    d.add(Rect(0, 0, w, h, rx=radius, ry=radius, fillColor=fill_color, strokeColor=border_color))
    return d


# ── Header/Footer ──
def draw_header(canvas, doc):
    canvas.saveState()
    # Decorative pastel circles in header area (subtle)
    # Top sage bar
    canvas.setFillColor(SAGE_500)
    canvas.rect(0, PAGE_H - 8*mm, PAGE_W, 8*mm, fill=1, stroke=0)
    # Bottom warm bar
    canvas.setFillColor(WARM_800)
    canvas.rect(0, 0, PAGE_W, 4*mm, fill=1, stroke=0)
    # Header text
    canvas.setFont('Helvetica-Bold', 10)
    canvas.setFillColor(white)
    canvas.drawString(20*mm, PAGE_H - 5*mm, 'Aliento')
    canvas.setFont('Helvetica', 6)
    canvas.drawString(20*mm, PAGE_H - 7.2*mm, 'Breathe, Screen, Live')
    canvas.drawRightString(PAGE_W - 20*mm, PAGE_H - 5*mm, 'www.alientomd.com')
    # Footer
    canvas.setFont('Helvetica', 7)
    canvas.setFillColor(white)
    canvas.drawCentredString(PAGE_W / 2, 1.3*mm, '© Aliento Health — Breathe, Screen, Live')
    canvas.restoreState()


# ── Cover Page ──
def build_cover(title, subtitle, content_lines):
    elements = []
    
    # Decorative pastel blobs (background)
    # Large sage blob top-right
    blob1 = pastel_circle(0, 0, 55*mm, '#D8EAE0', 0.2)
    elements.append(blob1)
    
    # Blush circle bottom-left
    blob2 = pastel_circle(0, 0, 40*mm, '#FDF5F5', 0.25)
    elements.append(blob2)
    
    # Small sage circle mid-right
    blob3 = pastel_circle(0, 0, 25*mm, '#D8EAE0', 0.15)
    elements.append(blob3)
    
    elements.append(Spacer(1, 45*mm))
    
    # Sage brand bar
    d = Drawing(170*mm, 5*mm)
    d.add(Rect(0, 0, 170*mm, 5*mm, rx=2*mm, fillColor=SAGE_500, strokeColor=None))
    elements.append(d)
    
    elements.append(Spacer(1, 8*mm))
    
    # Tagline
    elements.append(Paragraph(
        'Breathe, Screen, Live',
        ParagraphStyle('Tagline', fontName='Helvetica-Oblique', fontSize=12, textColor=SAGE_400, alignment=TA_LEFT, spaceAfter=2, leading=16)
    ))
    elements.append(Spacer(1, 6*mm))
    
    # Title
    elements.append(Paragraph(title, title_style))
    elements.append(Spacer(1, 2*mm))
    elements.append(HRFlowable(width='40%', thickness=1.5, color=SAGE_300, spaceAfter=14))
    elements.append(Paragraph(subtitle, subtitle_style))
    
    elements.append(Spacer(1, 4*mm))
    
    # Info box — PREMIUM with extra padding
    info_items = ['• {}'.format(line) for line in content_lines]
    info_text = '<br/>'.join(info_items)
    info_style = ParagraphStyle(
        'InfoBox', parent=body_style,
        fontSize=11, leading=19, textColor=WARM_700,
        backColor=CREAM_50,
        borderPadding=16, borderColor=SAGE_200, borderWidth=1,
        borderRadius=8,
    )
    elements.append(Paragraph(info_text, info_style))
    
    elements.append(Spacer(1, 55*mm))
    
    # Premium price card
    d = Drawing(170*mm, 34*mm)
    d.add(Rect(0, 0, 170*mm, 34*mm, rx=4*mm, fillColor=SAGE_50, strokeColor=SAGE_200))
    # Leaf icon in corner
    d.add(Rect(145*mm, 4*mm, 22*mm, 22*mm, rx=4*mm, fillColor=SAGE_400, strokeColor=None))
    # Breath wave in the leaf
    wave = Path()
    wave.moveTo(149*mm, 16*mm)
    wave.curveTo(152*mm, 12*mm, 154*mm, 12*mm, 156*mm, 16*mm)
    wave.curveTo(158*mm, 20*mm, 160*mm, 20*mm, 162*mm, 16*mm)
    d.add(wave)
    # Price text
    price_text = String(16*mm, 17*mm, 'Digital Guide — R50', fontName='Helvetica-Bold', fontSize=15, fillColor=SAGE_600)
    d.add(price_text)
    dr_text = String(16*mm, 4*mm, 'Prepared by Dr. Leegale Adonis (Aliento Health)', fontName='Helvetica', fontSize=9, fillColor=WARM_500)
    d.add(dr_text)
    elements.append(d)
    
    elements.append(PageBreak())
    return elements


# ── Content page decorators ──
def add_page_decorations(canvas, doc):
    """Add subtle pastel decorations to content pages."""
    canvas.saveState()
    # Subtle sage circle in top-right corner
    r = 30*mm
    cx = PAGE_W - 10*mm
    cy = PAGE_H - 50*mm
    canvas.setFillColor(Color(216/255, 234/255, 224/255, alpha=0.08))  # SAGE_100 at 8%
    canvas.circle(cx, cy, r, fill=1, stroke=0)
    # Subtle blush circle bottom-left
    cx2 = 15*mm
    cy2 = 40*mm
    canvas.setFillColor(Color(253/255, 245/255, 245/255, alpha=0.1))  # BLUSH_50 at 10%
    canvas.circle(cx2, cy2, 25*mm, fill=1, stroke=0)
    canvas.restoreState()


# ═══════════════════════════════════════════════════
#  PDF GENERATION
# ═══════════════════════════════════════════════════

def create_pdf(slug, guide_data):
    filename = os.path.join(OUTPUT_DIR, f'{slug}.pdf')
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=22*mm,
        rightMargin=22*mm,
        topMargin=18*mm,
        bottomMargin=18*mm,
    )

    elements = []

    # ── Cover Page ──
    elements.extend(build_cover(
        guide_data['title'],
        guide_data['subtitle'],
        guide_data['cover_lines'],
    ))

    # ── Content Pages ──
    for section_title, paragraphs in guide_data['sections']:
        if section_title:
            if section_title in ['Type 1 Diabetes', 'Type 2 Diabetes', 'Gestational Diabetes',
                                  'Reduce Your Salt Intake', 'Eat a Balanced Diet', 'Get Moving',
                                  'Limit Alcohol and Stop Smoking', 'Monitoring at Home',
                                  'Healthy Eating for Diabetes', 'Physical Activity',
                                  'Medication Management', 'Warning Signs & Complications',
                                  'In the South African Context', 'When to See Your Doctor',
                                  'Why Is Hypertension Dangerous?', 'Risk Factors',
                                  'Lifestyle Changes That Work', 'Medication Options',
                                  'What Are Chronic Conditions?', 'Building Your Healthcare Team',
                                  'Nutrition for Chronic Conditions', 'Mental Health & Emotional Wellbeing',
                                  'Organising Your Healthcare in South Africa', 'Preparing for Medical Appointments',
                                  'Emergency Signs']:
                elements.append(Paragraph(section_title, h3_style))
            else:
                elements.append(Paragraph(section_title, h2_style))
            elements.append(Spacer(1, 2*mm))

        for para in paragraphs:
            if para.startswith('• '):
                elements.append(Paragraph(para, bullet_style))
            else:
                elements.append(Paragraph(para, body_style))
                if para == paragraphs[-1]:
                    elements.append(Spacer(1, 4*mm))

    # ── Final Page — Disclaimer & Contact ──
    elements.append(Spacer(1, 24*mm))
    elements.append(HRFlowable(width='100%', thickness=1, color=WARM_200, spaceAfter=14))
    elements.append(Paragraph(
        'Disclaimer',
        ParagraphStyle('DisclaimerTitle', parent=h3_style, textColor=WARM_400, spaceAfter=8, fontSize=12)
    ))
    elements.append(Paragraph(
        'This guide is for informational purposes only and does not constitute medical advice. '
        'Always consult a qualified healthcare professional for diagnosis, treatment, and management '
        'of any health condition. Aliento Health and Dr. Leegale Adonis accept no liability for '
        'actions taken based on the information in this guide.',
        ParagraphStyle('DisclaimerBody', parent=body_style, fontSize=9, leading=13, textColor=WARM_400)
    ))
    elements.append(Spacer(1, 10*mm))
    elements.append(Paragraph(
        'Contact Aliento Health',
        ParagraphStyle('ContactTitle', parent=h3_style, textColor=SAGE_500, spaceAfter=8, fontSize=12)
    ))
    elements.append(Paragraph(
        'Website: www.alientomd.com &nbsp;|&nbsp; Email: info@alientomedical.com',
        ParagraphStyle('ContactBody', parent=body_style, fontSize=10, textColor=WARM_600, alignment=TA_LEFT)
    ))

    doc.build(elements, onFirstPage=draw_header, onLaterPages=draw_header)
    print(f'✓ Created premium PDF: {filename}')
    return filename


# ═══════════════════════════════════════════════════
#  CONTENT DATA
# ═══════════════════════════════════════════════════

GUIDES = {
    'diabetes': {
        'title': 'Understanding & Managing Diabetes',
        'subtitle': 'A practical guide to living well with diabetes — from diagnosis to daily management',
        'cover_lines': [
            'What diabetes is and the different types',
            'How to monitor your blood sugar effectively',
            'Diet, exercise, and medication management',
            'Warning signs, complications, and when to see your doctor',
            'South African context: access to care and support',
        ],
        'sections': [
            ('What Is Diabetes?', [
                'Diabetes is a chronic condition that affects how your body turns food into energy. When you eat, your body breaks down carbohydrates into glucose (sugar), which enters your bloodstream. Your pancreas produces insulin — a hormone that acts like a key, helping glucose enter your cells to be used for energy.',
                'In diabetes, either your pancreas doesn\'t produce enough insulin, or your body\'s cells don\'t respond to insulin properly. This causes glucose to build up in your bloodstream, leading to high blood sugar levels.',
                'There are three main types of diabetes:',
            ]),
            ('Type 1 Diabetes', [
                'Type 1 diabetes is an autoimmune condition where the immune system attacks and destroys the insulin-producing cells in the pancreas. It typically develops in children and young adults, though it can appear at any age.',
                'People with Type 1 diabetes require daily insulin injections or an insulin pump to survive. There is currently no cure, but with proper management, people with Type 1 diabetes can live long, healthy lives.',
                'Symptoms often appear suddenly and include excessive thirst, frequent urination, unexplained weight loss, and extreme fatigue.',
            ]),
            ('Type 2 Diabetes', [
                'Type 2 diabetes is the most common form, affecting about 90% of people with diabetes. It occurs when your body becomes resistant to insulin or doesn\'t produce enough insulin. It\'s strongly linked to lifestyle factors including diet, physical activity, and weight.',
                'Type 2 diabetes often develops gradually over many years. Early symptoms may be mild or go unnoticed, which is why regular screening is important — especially if you have risk factors such as being over 45, having a family history of diabetes, being overweight, or having high blood pressure.',
                'Management includes lifestyle changes, oral medications, and sometimes insulin. Many people with Type 2 diabetes can achieve good control through diet and exercise alone, especially when diagnosed early.',
            ]),
            ('Gestational Diabetes', [
                'Gestational diabetes develops during pregnancy and usually resolves after childbirth. However, it increases the risk of developing Type 2 diabetes later in life for both mother and child.',
                'Screening for gestational diabetes is typically done between 24 and 28 weeks of pregnancy. Management focuses on blood sugar control through diet, exercise, and sometimes medication to protect both mother and baby.',
            ]),
            ('Monitoring Your Blood Sugar', [
                'Regular blood sugar monitoring is the cornerstone of diabetes management. Your healthcare provider will recommend a target range for your blood sugar levels. Generally, fasting levels should be between 4.0 and 7.0 mmol/L, and post-meal levels should be below 10.0 mmol/L.',
                'Keep a log of your readings — note the date, time, reading, and any factors that may have affected it (what you ate, exercise, stress, illness). This information helps you and your doctor make informed decisions about your treatment plan.',
                'Your doctor may also recommend a HbA1c test every 3 to 6 months. This measures your average blood sugar control over the past 2-3 months. The general target is below 7% (53 mmol/mol).',
            ]),
            ('Healthy Eating for Diabetes', [
                'Eating well with diabetes doesn\'t mean restrictive diets. Focus on:',
            ]),
            ('', [
                '• Choose whole grains over refined carbohydrates (brown rice, oats, wholewheat bread)',
                '• Eat plenty of vegetables — at least 5 portions a day',
                '• Include lean protein with every meal (chicken, fish, eggs, beans, lentils)',
                '• Limit sugary drinks, sweets, and processed foods',
                '• Watch portion sizes — even healthy foods can raise blood sugar in large amounts',
                '• Stay hydrated with water or unsweetened beverages',
                '• Consider the glycaemic index (GI) of foods — low GI foods release sugar more slowly',
            ]),
            ('Physical Activity', [
                'Regular physical activity helps your body use insulin more effectively and lowers blood sugar levels. Aim for at least 150 minutes of moderate exercise per week — that\'s about 30 minutes, 5 days a week.',
                'Good options include brisk walking, swimming, cycling, dancing, or gardening. Start slowly if you\'ve been inactive and gradually increase intensity. Always check with your doctor before starting a new exercise program.',
                'Check your blood sugar before and after exercise, especially if you take insulin or certain diabetes medications, as exercise can cause hypoglycaemia (low blood sugar).',
            ]),
            ('Medication Management', [
                'If lifestyle changes aren\'t enough to control your blood sugar, your doctor may prescribe medication. Common options include:',
            ]),
            ('', [
                '• Metformin — the most common first-line medication for Type 2 diabetes',
                '• Sulphonylureas — help your pancreas produce more insulin',
                '• DPP-4 inhibitors — help lower blood sugar without causing hypoglycaemia',
                '• SGLT2 inhibitors — help your kidneys remove excess glucose through urine',
                '• Insulin therapy — essential for Type 1 diabetes and sometimes needed for Type 2',
            ]),
            ('Warning Signs & Complications', [
                'Untreated or poorly managed diabetes can lead to serious complications. Watch for:',
            ]),
            ('', [
                '• Frequent infections or slow-healing wounds',
                '• Numbness or tingling in your hands or feet (neuropathy)',
                '• Vision changes or blurred vision (retinopathy)',
                '• Kidney problems (nephropathy)',
                '• Heart disease and stroke — diabetes significantly increases your risk',
            ]),
            ('', [
                'Regular check-ups with your healthcare team can catch complications early when they\'re most treatable. This includes annual eye exams, foot checks, kidney function tests, and cardiovascular screening.',
            ]),
            ('In the South African Context', [
                'South Africa has the highest rate of diabetes in Africa, with an estimated 4.5 million adults living with the condition. Access to care varies widely, but support is available:',
            ]),
            ('', [
                '• Public healthcare: Diabetes care is available at primary healthcare clinics nationwide. Medications on the Essential Medicines List are provided free of charge at public facilities.',
                '• Private healthcare: Medical aid schemes typically cover diabetes management, including medication, glucose monitoring supplies, and annual screening.',
                '• Support organisations: Diabetes South Africa (www.diabetessa.org.za) offers education, support groups, and advocacy for people living with diabetes.',
                '• Community health workers: Many communities have trained health workers who can provide education and support for diabetes management.',
            ]),
            ('When to See Your Doctor', [
                'Contact your healthcare provider immediately if you experience:',
            ]),
            ('', [
                '• Blood sugar consistently above 15 mmol/L or below 4 mmol/L',
                '• Symptoms of diabetic ketoacidosis (DKA): nausea, vomiting, abdominal pain, fruity-smelling breath, rapid breathing',
                '• Signs of infection: fever, redness, swelling, or pus around a wound',
                '• Vision changes, chest pain, or shortness of breath',
                '• Numbness or tingling that interferes with daily activities',
            ]),
        ],
    },
    'hypertension': {
        'title': 'Understanding & Managing Hypertension',
        'subtitle': 'Your complete guide to controlling high blood pressure and protecting your heart',
        'cover_lines': [
            'What blood pressure numbers mean and why they matter',
            'Lifestyle changes that can lower your blood pressure',
            'Medication options and how they work',
            'Complications to watch for and how to prevent them',
            'South African context: access to treatment and support',
        ],
        'sections': [
            ('What Is Hypertension?', [
                'Hypertension, commonly known as high blood pressure, is a condition where the force of blood against your artery walls is consistently too high. Think of it like water pressure in a hose — when the pressure is too high, it puts strain on the entire system.',
                'Blood pressure is measured in millimetres of mercury (mmHg) and recorded as two numbers:',
            ]),
            ('', [
                '• Systolic (top number): The pressure when your heart beats and pumps blood',
                '• Diastolic (bottom number): The pressure when your heart rests between beats',
            ]),
            ('', [
                'A normal blood pressure reading is below 120/80 mmHg. Hypertension is diagnosed when readings are consistently 140/90 mmHg or higher. Readings between 120-139/80-89 mmHg are considered "elevated" or "prehypertension" and should be monitored.',
            ]),
            ('Why Is Hypertension Dangerous?', [
                'Hypertension is often called the "silent killer" because it typically has no symptoms. Many people walk around with dangerously high blood pressure for years without knowing it. Meanwhile, the constant pressure damages your arteries and organs.',
                'Untreated hypertension can lead to:',
            ]),
            ('', [
                '• Heart attack and heart failure — the heart has to work harder to pump blood',
                '• Stroke — damaged arteries in the brain can rupture or clog',
                '• Kidney damage — delicate blood vessels in the kidneys are easily damaged',
                '• Vision loss — damage to blood vessels in the eyes',
                '• Aneurysm — weakened artery walls can bulge and rupture',
            ]),
            ('Risk Factors', [
                'Some risk factors for hypertension are beyond your control:',
            ]),
            ('', [
                '• Age — risk increases as you get older',
                '• Family history — hypertension often runs in families',
                '• Ethnicity — people of African descent are at higher risk',
                '• Chronic conditions — diabetes, kidney disease, and sleep apnoea increase risk',
            ]),
            ('', [
                'But many risk factors are within your control:',
            ]),
            ('', [
                '• Being overweight or obese',
                '• A diet high in salt and low in potassium',
                '• Lack of physical activity',
                '• Excessive alcohol consumption',
                '• Smoking',
                '• Chronic stress',
            ]),
            ('Lifestyle Changes That Work', [
                'Lifestyle modifications are the foundation of hypertension management. In many cases, they can reduce or even eliminate the need for medication.',
            ]),
            ('Reduce Your Salt Intake', [
                'South Africans consume an average of 8-10 grams of salt per day — double the recommended maximum of 5 grams (about one teaspoon). Salt causes your body to retain water, which increases blood volume and pressure.',
                'Tips to cut salt:',
            ]),
            ('', [
                '• Don\'t add salt at the table — taste your food first',
                '• Use herbs, spices, garlic, and lemon instead of salt for flavouring',
                '• Check food labels — choose products with less than 400mg sodium per 100g',
                '• Limit processed foods, takeaways, and restaurant meals',
                '• Rinse canned vegetables and beans to remove excess salt',
            ]),
            ('Eat a Balanced Diet', [
                'The DASH (Dietary Approaches to Stop Hypertension) diet is specifically designed to lower blood pressure. It emphasises:',
            ]),
            ('', [
                '• Fruits and vegetables — at least 4-5 servings each per day',
                '• Whole grains — oats, brown rice, wholewheat bread',
                '• Lean proteins — fish, chicken, legumes, nuts',
                '• Low-fat dairy products',
                '• Limited red meat, sweets, and sugary beverages',
            ]),
            ('Get Moving', [
                'Regular physical activity strengthens your heart so it can pump blood with less effort. Aim for at least 30 minutes of moderate exercise most days of the week.',
                'Walking is one of the best exercises for blood pressure control. It\'s free, requires no equipment, and can be done anywhere. Start with 10-minute walks and gradually increase duration and frequency.',
            ]),
            ('Limit Alcohol and Stop Smoking', [
                'Alcohol can raise blood pressure, even in moderate amounts. If you drink, limit yourself to one drink per day for women and two for men.',
                'Smoking causes an immediate spike in blood pressure and heart rate. Quitting is one of the most important things you can do for your cardiovascular health.',
            ]),
            ('Medication Options', [
                'When lifestyle changes aren\'t enough, medication can effectively control hypertension. Several types work in different ways:',
            ]),
            ('', [
                '• Diuretics ("water pills") — help your kidneys remove excess sodium and water',
                '• ACE inhibitors — relax blood vessels by blocking the formation of a hormone that narrows them',
                '• ARBs (Angiotensin II receptor blockers) — protect blood vessels from narrowing',
                '• Calcium channel blockers — relax blood vessel walls',
                '• Beta-blockers — reduce heart rate and the force of heart contractions',
            ]),
            ('', [
                'Most people need two or more medications to achieve good blood pressure control. It may take time to find the right combination for you. Always take your medication as prescribed — don\'t stop even if you feel fine.',
            ]),
            ('Monitoring at Home', [
                'Home blood pressure monitoring is an essential tool for managing hypertension.',
                'Tips for accurate home monitoring:',
            ]),
            ('', [
                '• Use a validated automatic upper-arm monitor (not wrist or finger devices)',
                '• Sit quietly for 5 minutes before measuring',
                '• Place the cuff on bare skin at heart level',
                '• Don\'t smoke, exercise, or drink caffeine within 30 minutes of measuring',
                '• Take readings at the same time each day, morning and evening',
                '• Record your readings and bring them to your appointments',
            ]),
            ('In the South African Context', [
                'Hypertension affects approximately 1 in 3 South African adults, making it one of the most common chronic conditions in the country.',
            ]),
            ('', [
                '• Public healthcare: Blood pressure medication is available at primary healthcare clinics, often free of charge.',
                '• Pharmacies: Many pharmacies offer free blood pressure checks — Clicks, Dis-Chem, and community pharmacies.',
                '• Support: The Heart and Stroke Foundation South Africa (www.heartfoundation.co.za) provides education and resources.',
            ]),
            ('When to See Your Doctor', [
                'Seek medical attention if:',
            ]),
            ('', [
                '• Your blood pressure is consistently above 140/90 mmHg despite treatment',
                '• You experience severe headaches, chest pain, shortness of breath, or vision changes',
                '• Your blood pressure spikes above 180/120 mmHg — a hypertensive crisis requiring immediate attention',
                '• You have side effects from your medication',
                '• You\'re planning to become pregnant',
            ]),
        ],
    },
    'chronic-conditions': {
        'title': 'Managing Chronic Health Conditions',
        'subtitle': 'A practical guide for living well with long-term health conditions',
        'cover_lines': [
            'Understanding chronic conditions and their impact',
            'Building a management plan that works for you',
            'Medication, lifestyle, and monitoring essentials',
            'Mental health and emotional wellbeing',
            'Navigating South Africa\'s healthcare system',
        ],
        'sections': [
            ('What Are Chronic Conditions?', [
                'Chronic conditions are long-term health issues that require ongoing management. Unlike acute illnesses that come and go quickly, they persist for months or years.',
                'Common chronic conditions include diabetes, hypertension, asthma, arthritis, heart disease, chronic kidney disease, and depression. Many people live with more than one — known as multimorbidity.',
                'Living with a chronic condition doesn\'t mean you can\'t live well. With proper management, most people can lead full, active, and productive lives.',
            ]),
            ('Building Your Healthcare Team', [
                'Managing a chronic condition is a team effort. Your healthcare team may include:',
            ]),
            ('', [
                '• Your primary care doctor or general practitioner — your first point of contact and care coordinator',
                '• Specialists — such as endocrinologists (diabetes), cardiologists (heart), or pulmonologists (lungs)',
                '• Nurses — for monitoring, education, and ongoing support',
                '• Dietitians — for personalised nutrition advice',
                '• Physiotherapists — for exercise and mobility support',
                '• Pharmacists — for medication advice and management',
                '• Mental health professionals — counsellors or psychologists for emotional support',
            ]),
            ('', [
                'Build a relationship with each team member. Don\'t be afraid to ask questions, seek second opinions, or request referrals. You are the most important member of your healthcare team.',
            ]),
            ('Medication Management', [
                'Many chronic conditions require long-term medication. These tips will help you stay on track:',
            ]),
            ('', [
                '• Understand what each medication does and why you\'re taking it',
                '• Take medications at the same time each day — link them to daily habits',
                '• Use a pill organizer or medication reminder app',
                '• Keep a list of all your medications, including dosages and frequency',
                '• Refill prescriptions before you run out — set a reminder',
                '• Never stop medication without consulting your doctor, even if you feel better',
                '• Report side effects to your doctor — there may be alternatives',
            ]),
            ('Monitoring Your Condition', [
                'Regular monitoring helps you and your healthcare team track your condition.',
            ]),
            ('', [
                '• Blood pressure checks — at home and at medical appointments',
                '• Blood sugar monitoring — if you have diabetes',
                '• Weight tracking — important for heart disease and diabetes',
                '• Symptom diaries — note when symptoms occur, their severity, and possible triggers',
                '• Regular blood tests — as recommended by your doctor',
                '• Annual check-ups — comprehensive reviews of your overall health',
            ]),
            ('Nutrition for Chronic Conditions', [
                'What you eat has a profound impact on chronic conditions. Key principles:',
            ]),
            ('', [
                '• Eat plenty of vegetables and fruits — at least 5 portions daily',
                '• Choose whole grains over refined carbohydrates',
                '• Include lean protein sources — fish, chicken, eggs, legumes',
                '• Limit processed foods, sugar, and unhealthy fats',
                '• Reduce salt intake — aim for less than 5g per day',
                '• Stay hydrated — drink 6-8 glasses of water daily',
                '• Eat mindfully — pay attention to hunger and fullness cues',
            ]),
            ('', [
                'Consider consulting a registered dietitian who can create a personalised eating plan that takes all your conditions and medications into account.',
            ]),
            ('Physical Activity', [
                'Exercise is one of the most powerful tools for managing chronic conditions. It improves heart health, blood sugar control, joint function, mood, and sleep quality.',
                'Start where you are. If you\'ve been inactive, begin with 5-10 minutes of gentle activity — a short walk, gentle stretching, or chair exercises. Gradually increase as your fitness improves.',
                'Always check with your doctor before starting a new exercise programme, especially if you have heart disease, poorly controlled diabetes, or joint problems.',
            ]),
            ('Mental Health & Emotional Wellbeing', [
                'Living with a chronic condition can take a toll on your mental health. It\'s normal to feel frustrated, anxious, or depressed at times.',
            ]),
            ('', [
                '• Talk to someone — family, friends, or a support group',
                '• Consider professional help — counselling or therapy can make a significant difference',
                '• Practice stress management — deep breathing, meditation, or gentle yoga',
                '• Stay connected — isolation can worsen both physical and mental health',
                '• Set realistic goals — celebrate small victories',
                '• Be kind to yourself — some days will be harder than others, and that\'s okay',
            ]),
            ('Organising Your Healthcare in South Africa', [
                'Navigating healthcare in South Africa can be complex:',
            ]),
            ('', [
                '• Public sector: Chronic conditions are managed at primary healthcare clinics and community health centres. Medications are often available at no cost.',
                '• Private sector: Most medical aid schemes offer chronic disease management programmes. Check with your scheme for condition-specific benefits.',
                '• Medication: Chronic medications can be collected from public clinics or private pharmacies. Some medical aids offer chronic medicine delivery.',
                '• Annual reviews: Even if you feel well, attend annual reviews to screen for complications early.',
            ]),
            ('Preparing for Medical Appointments', [
                'Make the most of your time with healthcare providers:',
            ]),
            ('', [
                '• Bring a list of your current medications (including doses and frequency)',
                '• Write down your questions before the appointment',
                '• Bring your monitoring records (blood pressure log, blood sugar diary, etc.)',
                '• Note any new symptoms or changes since your last visit',
                '• Bring a family member or friend if you need support',
                '• Ask for clarification if you don\'t understand something',
            ]),
            ('Emergency Signs', [
                'Know when to seek immediate medical attention:',
            ]),
            ('', [
                '• Chest pain, pressure, or discomfort — especially with shortness of breath',
                '• Sudden severe headache, confusion, or trouble speaking',
                '• Difficulty breathing or wheezing that doesn\'t improve',
                '• Blood sugar above 20 mmol/L or below 3.5 mmol/L',
                '• Blood pressure above 180/120 mmHg',
                '• Signs of stroke: facial drooping, arm weakness, speech difficulty',
                '• Fainting or loss of consciousness',
            ]),
            ('', [
                'Keep emergency numbers handy: 10177 (ambulance), 112 (mobile emergency), or your local hospital\'s emergency department.',
            ]),
        ],
    },
}


if __name__ == '__main__':
    generated = []
    for slug, guide_data in GUIDES.items():
        path = create_pdf(slug, guide_data)
        file_size = os.path.getsize(path)
        generated.append((slug, path, file_size))
        print(f'  Size: {file_size / 1024:.1f} KB')

    print('\n═══════════════════════════════════════')
    print('All PREMIUM PDFs generated!')
    print('═══════════════════════════════════════')
    for slug, path, size in generated:
        print(f'  {slug}.pdf → {size/1024:.1f} KB')
