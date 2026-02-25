const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL  = process.env.OPENAI_MODEL || 'gpt-4o-mini'; // mini = cheaper, still great

async function callAI(systemPrompt, userContent, logData = {}) {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userContent }
    ],
    temperature: 0.7,
    max_tokens: 3000
  });

  const content = response.choices[0].message.content;

  // Log usage
  if (logData.userId) {
    try {
      const { usage } = response;
      const costPaise = Math.ceil((usage.total_tokens / 1000) * 1); // gpt-4o-mini ~₹0.01/1k
      await global.prisma.aiLog.create({
        data: {
          userId:       logData.userId,
          resumeId:     logData.resumeId || null,
          actionType:   logData.actionType || 'general',
          inputTokens:  usage.prompt_tokens,
          outputTokens: usage.completion_tokens,
          costPaise
        }
      });
    } catch (e) { /* non-fatal */ }
  }

  return content;
}

function extractJSON(text) {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

// ── A: Parse text → resume JSON ───────────────────────────────────────────────
async function parseTextToResume(rawText, userId) {
  const sys = `You are a senior HR analyst. Extract resume data from raw text.
Return ONLY valid JSON with this exact schema:
{"personal":{"name":"","email":"","phone":"","location":"","linkedin":"","portfolio":""},"summary":"","experience":[{"title":"","company":"","location":"","start":"","end":"","current":false,"bullets":[]}],"education":[{"degree":"","institution":"","year":"","gpa":""}],"skills":{"technical":[],"soft":[],"tools":[]},"certifications":[{"name":"","issuer":"","year":""}],"projects":[{"name":"","description":"","link":"","tech":[]}],"achievements":[],"languages":[]}
Do not invent data. Write bullets professionally. No markdown, no explanation.`;

  const result = await callAI(sys, rawText, { userId, actionType: 'parse_text' });
  return extractJSON(result);
}

// ── B: Optimize for role ──────────────────────────────────────────────────────
async function optimizeForRole(resumeData, jobRole, userId, resumeId) {
  const sys = `You are an expert ATS specialist. Rewrite the resume for the job role.
Rules: Strong action verbs + numbers, role keywords, improved summary. Never invent fake experience.
Return ONLY JSON: {"resumeData":{...full resume...},"suggestions":[],"missingSkills":[],"changes":[]}`;

  const result = await callAI(sys,
    `Job Role: ${jobRole}\nResume:\n${JSON.stringify(resumeData, null, 2)}`,
    { userId, resumeId, actionType: 'optimize' }
  );
  return extractJSON(result);
}

// ── C: Match JD ───────────────────────────────────────────────────────────────
async function matchToJobDescription(resumeData, jobDescription, userId, resumeId) {
  const sys = `You are an ATS expert. Compare resume to job description.
Return ONLY JSON: {"matchScore":0-100,"matchedKeywords":[],"missingKeywords":[],"sectionsToStrengthen":[],"suggestions":[],"optimizedResume":{...full resume...}}`;

  const result = await callAI(sys,
    `Resume:\n${JSON.stringify(resumeData, null, 2)}\n\nJob Description:\n${jobDescription}`,
    { userId, resumeId, actionType: 'match_jd' }
  );
  return extractJSON(result);
}

// ── D: ATS Score ──────────────────────────────────────────────────────────────
async function calculateATSScore(resumeData, jobRole, userId, resumeId) {
  const sys = `You are an ATS system. Score this resume.
Return ONLY JSON: {"total":0-100,"breakdown":{"keywords":{"score":0-30,"max":30,"feedback":""},"headings":{"score":0-20,"max":20,"feedback":""},"formatting":{"score":0-15,"max":15,"feedback":""},"actionVerbs":{"score":0-15,"max":15,"feedback":""},"metrics":{"score":0-10,"max":10,"feedback":""},"contact":{"score":0-10,"max":10,"feedback":""}},"missingKeywords":[],"topIssues":[],"quickWins":[]}`;

  const result = await callAI(sys,
    `Job Role: ${jobRole || 'General'}\nResume:\n${JSON.stringify(resumeData, null, 2)}`,
    { userId, resumeId, actionType: 'ats_score' }
  );
  return extractJSON(result);
}

// ── E: Chat — stateless (no history to save tokens) ──────────────────────────
async function chatAssistant(message, resumeData, _ignored, userId, resumeId) {
  const sys = `You are an expert resume coach. The user has 3 free AI chats per day so be concise and impactful.
You can see their resume. When asked to make changes, return the updated field.
Return ONLY JSON: {"message":"your reply","action":"update|none","field":"summary|experience|skills|achievements|personal|education|projects|certifications|null","value":<new content or null>,"resumeData":<full updated resume if action=update, else null>}`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: sys },
      { role: 'user',   content: `Resume:\n${JSON.stringify(resumeData, null, 2)}\n\nQuestion: ${message}` }
    ],
    temperature: 0.7,
    max_tokens: 2000   // smaller cap = cheaper per chat
  });

  const content = response.choices[0].message.content;
  if (userId) {
    const { usage } = response;
    await global.prisma.aiLog.create({
      data: { userId, resumeId, actionType: 'chat', inputTokens: usage.prompt_tokens, outputTokens: usage.completion_tokens, costPaise: Math.ceil((usage.total_tokens / 1000) * 1) }
    }).catch(() => {});
  }

  return extractJSON(content);
}

// ── F: Recruiter view ─────────────────────────────────────────────────────────
async function recruiterView(resumeData, userId, resumeId) {
  const sys = `Simulate a recruiter doing a 6-second resume scan.
Return ONLY JSON: {"firstImpression":"","eyePath":["1st","2nd","3rd","4th"],"greenFlags":[],"redFlags":[],"wouldInterview":true,"interviewProbability":0-100,"reason":"","improvementPriority":[],"standoutElements":[]}`;

  const result = await callAI(sys, JSON.stringify(resumeData, null, 2), { userId, resumeId, actionType: 'recruiter_view' });
  return extractJSON(result);
}

// ── G: Suggest templates ──────────────────────────────────────────────────────
async function suggestTemplates(resumeData, jobRole, userId) {
  const sys = `You are a resume design expert. Recommend templates from: ats-classic, ats-modern, corporate-blue, tech-dark, creative-portfolio, fresher-simple, marketing-bold, sales-results, executive-premium, global-minimal.
Return ONLY JSON: {"recommendations":[{"templateId":"","rank":1,"reason":"","score":0-100}]}`;

  const result = await callAI(sys,
    `Job: ${jobRole || 'General'}, Experience: ${resumeData.experience?.length || 0} jobs`,
    { userId, actionType: 'suggest_templates' }
  );
  return extractJSON(result);
}

// ── H: Cover letter (paid) ────────────────────────────────────────────────────
async function generateCoverLetter(resumeData, jobRole, jobDescription, userId, resumeId) {
  const sys = `Write a professional cover letter. Return ONLY JSON: {"coverLetter":"full text","subject":"email subject line"}`;
  const result = await callAI(sys,
    `Resume: ${JSON.stringify(resumeData)}\nJob Role: ${jobRole}\nJob Description: ${jobDescription || 'Not provided'}`,
    { userId, resumeId, actionType: 'cover_letter' }
  );
  return extractJSON(result);
}

module.exports = {
  parseTextToResume, optimizeForRole, matchToJobDescription,
  calculateATSScore, chatAssistant, recruiterView,
  suggestTemplates, generateCoverLetter
};
