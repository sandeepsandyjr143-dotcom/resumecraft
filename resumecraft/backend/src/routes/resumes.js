const express = require('express');
const authMiddleware = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// All routes require auth
router.use(authMiddleware);

// Create resume
router.post('/', async (req, res) => {
  try {
    const { title, jobRole, resumeData, templateId } = req.body;
    const resume = await global.prisma.resume.create({
      data: {
        userId: req.user.id,
        title: title || 'Untitled Resume',
        jobRole,
        resumeData: resumeData || {},
        templateId
      }
    });
    res.status(201).json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

// List user's resumes
router.get('/', async (req, res) => {
  try {
    const resumes = await global.prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true, title: true, jobRole: true, templateId: true,
        atsScore: true, status: true, versionNumber: true,
        createdAt: true, updatedAt: true
      }
    });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// Get single resume
router.get('/:id', async (req, res) => {
  try {
    const resume = await global.prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// Update resume (auto-saves version)
router.put('/:id', async (req, res) => {
  try {
    const existing = await global.prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!existing) return res.status(404).json({ error: 'Resume not found' });

    const { title, jobRole, resumeData, templateId, atsScore } = req.body;

    // Save version snapshot every 5 versions
    if (existing.versionNumber % 5 === 0) {
      await global.prisma.resumeVersion.create({
        data: {
          resumeId: existing.id,
          data: existing.resumeData,
          version: existing.versionNumber
        }
      });
    }

    const updated = await global.prisma.resume.update({
      where: { id: req.params.id },
      data: {
        title: title ?? existing.title,
        jobRole: jobRole ?? existing.jobRole,
        resumeData: resumeData ?? existing.resumeData,
        templateId: templateId ?? existing.templateId,
        atsScore: atsScore ?? existing.atsScore,
        versionNumber: { increment: 1 }
      }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

// Delete resume
router.delete('/:id', async (req, res) => {
  try {
    const resume = await global.prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    await global.prisma.resume.delete({ where: { id: req.params.id } });
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

// Duplicate resume
router.post('/:id/duplicate', async (req, res) => {
  try {
    const original = await global.prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!original) return res.status(404).json({ error: 'Resume not found' });

    const copy = await global.prisma.resume.create({
      data: {
        userId: req.user.id,
        title: `${original.title} (Copy)`,
        jobRole: original.jobRole,
        resumeData: original.resumeData,
        templateId: original.templateId,
        parentResumeId: original.id
      }
    });

    res.status(201).json(copy);
  } catch (err) {
    res.status(500).json({ error: 'Failed to duplicate resume' });
  }
});

// Get version history
router.get('/:id/versions', async (req, res) => {
  try {
    const resume = await global.prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const versions = await global.prisma.resumeVersion.findMany({
      where: { resumeId: req.params.id },
      orderBy: { version: 'desc' }
    });
    res.json(versions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch versions' });
  }
});

// Generate public share link
router.post('/:id/share', async (req, res) => {
  try {
    const resume = await global.prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const slug = uuidv4().split('-')[0];
    const updated = await global.prisma.resume.update({
      where: { id: req.params.id },
      data: { isPublic: true, publicSlug: slug }
    });

    res.json({ shareUrl: `${process.env.FRONTEND_URL}/shared/${slug}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate share link' });
  }
});

// Get public resume by slug (no auth)
router.get('/public/:slug', async (req, res) => {
  try {
    const resume = await global.prisma.resume.findFirst({
      where: { publicSlug: req.params.slug, isPublic: true }
    });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

module.exports = router;
