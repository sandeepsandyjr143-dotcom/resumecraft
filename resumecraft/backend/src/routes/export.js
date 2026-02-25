const express = require('express');
const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, Packer } = require('docx');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Check export permission
async function checkExportPermission(userId, resumeId, templateIsPremium) {
  const actionType = templateIsPremium ? 'premium_template' : 'pdf_export';
  const payment = await global.prisma.payment.findFirst({
    where: { userId, resumeId, actionType, status: 'success' }
  });
  return { allowed: !!payment, actionType };
}

// Generate HTML resume for PDF
function generateResumeHTML(resumeData, templateId) {
  const d = resumeData;
  const personal = d.personal || {};

  const styles = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Arial, sans-serif; font-size: 11px; color: #333; line-height: 1.4; }
      .container { max-width: 750px; margin: 0 auto; padding: 30px; }
      .header { text-align: center; margin-bottom: 16px; border-bottom: 2px solid #333; padding-bottom: 12px; }
      .header h1 { font-size: 22px; font-weight: bold; color: #111; }
      .contact { font-size: 10px; color: #555; margin-top: 4px; }
      .section { margin-bottom: 14px; }
      .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #999; padding-bottom: 2px; margin-bottom: 8px; color: #222; }
      .summary { font-size: 11px; line-height: 1.5; }
      .job { margin-bottom: 10px; }
      .job-header { display: flex; justify-content: space-between; }
      .job-title { font-weight: bold; font-size: 11px; }
      .job-company { font-style: italic; }
      .job-date { font-size: 10px; color: #666; }
      ul { padding-left: 16px; margin-top: 4px; }
      ul li { margin-bottom: 2px; font-size: 10.5px; }
      .skills-list { display: flex; flex-wrap: wrap; gap: 6px; }
      .skill-tag { background: #f0f0f0; padding: 2px 8px; border-radius: 3px; font-size: 10px; }
      .edu-item { margin-bottom: 6px; }
      .watermark { position: fixed; bottom: 20px; right: 20px; font-size: 9px; color: #ccc; }
    </style>
  `;

  const contactParts = [personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean);

  const experienceHTML = (d.experience || []).map(exp => `
    <div class="job">
      <div class="job-header">
        <div>
          <span class="job-title">${exp.title || ''}</span>
          ${exp.company ? ` — <span class="job-company">${exp.company}</span>` : ''}
          ${exp.location ? `, ${exp.location}` : ''}
        </div>
        <div class="job-date">${exp.start || ''} ${exp.end ? '– ' + exp.end : exp.current ? '– Present' : ''}</div>
      </div>
      ${exp.bullets && exp.bullets.length > 0 ? `<ul>${exp.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('');

  const educationHTML = (d.education || []).map(edu => `
    <div class="edu-item">
      <strong>${edu.degree || ''}</strong>${edu.institution ? ` — ${edu.institution}` : ''}
      <span style="float:right;font-size:10px;color:#666">${edu.year || ''}</span>
      ${edu.gpa ? `<br><span style="font-size:10px">GPA: ${edu.gpa}</span>` : ''}
    </div>
  `).join('');

  const allSkills = [
    ...(d.skills?.technical || []),
    ...(d.skills?.tools || []),
    ...(d.skills?.soft || [])
  ];

  const skillsHTML = allSkills.length > 0
    ? `<div class="skills-list">${allSkills.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>`
    : '';

  const achievementsHTML = (d.achievements || []).length > 0
    ? `<ul>${d.achievements.map(a => `<li>${a}</li>`).join('')}</ul>`
    : '';

  const certificationsHTML = (d.certifications || []).map(c =>
    `<div>${c.name}${c.issuer ? ` — ${c.issuer}` : ''}${c.year ? `, ${c.year}` : ''}</div>`
  ).join('');

  const projectsHTML = (d.projects || []).map(p => `
    <div style="margin-bottom:8px">
      <strong>${p.name || ''}</strong>${p.link ? ` (<a href="${p.link}">${p.link}</a>)` : ''}
      ${p.tech && p.tech.length > 0 ? `<span style="font-size:10px;color:#555"> | ${p.tech.join(', ')}</span>` : ''}
      ${p.description ? `<div style="margin-top:2px;font-size:10.5px">${p.description}</div>` : ''}
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">${styles}</head>
<body>
<div class="container">
  <div class="header">
    <h1>${personal.name || 'Your Name'}</h1>
    <div class="contact">${contactParts.join(' | ')}</div>
    ${personal.portfolio ? `<div class="contact">${personal.portfolio}</div>` : ''}
  </div>

  ${d.summary ? `<div class="section"><div class="section-title">Professional Summary</div><div class="summary">${d.summary}</div></div>` : ''}

  ${experienceHTML ? `<div class="section"><div class="section-title">Work Experience</div>${experienceHTML}</div>` : ''}

  ${educationHTML ? `<div class="section"><div class="section-title">Education</div>${educationHTML}</div>` : ''}

  ${skillsHTML ? `<div class="section"><div class="section-title">Skills</div>${skillsHTML}</div>` : ''}

  ${projectsHTML ? `<div class="section"><div class="section-title">Projects</div>${projectsHTML}</div>` : ''}

  ${achievementsHTML ? `<div class="section"><div class="section-title">Achievements</div>${achievementsHTML}</div>` : ''}

  ${certificationsHTML ? `<div class="section"><div class="section-title">Certifications</div>${certificationsHTML}</div>` : ''}
</div>
</body>
</html>`;
}

// Export PDF (requires payment or adds watermark)
router.get('/:resumeId/pdf', async (req, res) => {
  try {
    const resume = await global.prisma.resume.findFirst({
      where: { id: req.params.resumeId, userId: req.user.id }
    });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const { watermark } = req.query;
    const isFree = watermark === 'true';

    if (!isFree) {
      const { TEMPLATES } = require('./templates');
      const template = TEMPLATES.find(t => t.id === resume.templateId);
      const isPremium = template?.isPremium || false;
      const { allowed, actionType } = await checkExportPermission(req.user.id, resume.id, isPremium);

      if (!allowed) {
        return res.status(402).json({
          error: 'Payment required',
          actionType,
          requiresPayment: true
        });
      }
    }

    let html = generateResumeHTML(resume.resumeData, resume.templateId);

    if (isFree) {
      html = html.replace('</body>', `
        <div class="watermark">Generated by ResumeCraft.in — Free Version</div>
        </body>`);
    }

    // Try puppeteer if available, otherwise return HTML for client-side print
    try {
      const puppeteer = require('puppeteer-core');
      const chromium = require('@sparticuz/chromium');

      const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
      await browser.close();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${resume.title.replace(/[^a-z0-9]/gi, '_')}_resume.pdf"`);
      res.send(pdfBuffer);
    } catch (puppeteerErr) {
      // Fallback: return HTML for client-side printing
      console.log('Puppeteer not available, returning HTML:', puppeteerErr.message);
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export PDF' });
  }
});

// Export DOCX
router.get('/:resumeId/docx', async (req, res) => {
  try {
    const resume = await global.prisma.resume.findFirst({
      where: { id: req.params.resumeId, userId: req.user.id }
    });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const { allowed } = await checkExportPermission(req.user.id, resume.id, false);
    if (!allowed) {
      return res.status(402).json({ error: 'Payment required', requiresPayment: true });
    }

    const d = resume.resumeData;
    const personal = d.personal || {};

    const children = [];

    // Name
    if (personal.name) {
      children.push(new Paragraph({
        text: personal.name,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER
      }));
    }

    // Contact
    const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean);
    if (contactParts.length > 0) {
      children.push(new Paragraph({
        text: contactParts.join(' | '),
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }));
    }

    // Summary
    if (d.summary) {
      children.push(new Paragraph({ text: 'PROFESSIONAL SUMMARY', heading: HeadingLevel.HEADING_2 }));
      children.push(new Paragraph({ text: d.summary, spacing: { after: 200 } }));
    }

    // Experience
    if (d.experience?.length > 0) {
      children.push(new Paragraph({ text: 'WORK EXPERIENCE', heading: HeadingLevel.HEADING_2 }));
      for (const exp of d.experience) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: exp.title || '', bold: true }),
            new TextRun({ text: exp.company ? ` — ${exp.company}` : '' }),
          ]
        }));
        if (exp.start) {
          children.push(new Paragraph({ text: `${exp.start} – ${exp.end || 'Present'}`, style: 'aside' }));
        }
        for (const bullet of (exp.bullets || [])) {
          children.push(new Paragraph({ text: bullet, bullet: { level: 0 } }));
        }
        children.push(new Paragraph({ text: '' }));
      }
    }

    // Education
    if (d.education?.length > 0) {
      children.push(new Paragraph({ text: 'EDUCATION', heading: HeadingLevel.HEADING_2 }));
      for (const edu of d.education) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: edu.degree || '', bold: true }),
            new TextRun({ text: edu.institution ? ` — ${edu.institution}` : '' }),
            new TextRun({ text: edu.year ? `, ${edu.year}` : '' })
          ],
          spacing: { after: 100 }
        }));
      }
    }

    // Skills
    const allSkills = [...(d.skills?.technical || []), ...(d.skills?.tools || []), ...(d.skills?.soft || [])];
    if (allSkills.length > 0) {
      children.push(new Paragraph({ text: 'SKILLS', heading: HeadingLevel.HEADING_2 }));
      children.push(new Paragraph({ text: allSkills.join(', ') }));
    }

    const doc = new Document({ sections: [{ children }] });
    const buffer = await Packer.toBuffer(doc);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title.replace(/[^a-z0-9]/gi, '_')}_resume.docx"`);
    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export DOCX' });
  }
});

module.exports = router;
