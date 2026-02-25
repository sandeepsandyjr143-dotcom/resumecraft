const express = require('express');
const router = express.Router();

// Real styled SVG previews — no external image dependency
const TEMPLATES = [
  {
    id: 'ats-classic',
    name: 'ATS Classic',
    category: 'ats',
    isPremium: false,
    suitableFor: ['all'],
    sortOrder: 1,
    description: 'Single column, clean Arial. Maximum ATS compatibility.',
    bestFor: 'All industries',
    previewSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" width="200" height="260">
      <rect width="200" height="260" fill="#f9fafb"/>
      <rect x="0" y="0" width="200" height="50" fill="#1f2937"/>
      <rect x="14" y="12" width="100" height="8" rx="2" fill="#ffffff" opacity="0.9"/>
      <rect x="14" y="26" width="70" height="5" rx="1" fill="#9ca3af"/>
      <rect x="14" y="36" width="120" height="4" rx="1" fill="#6b7280"/>
      <rect x="14" y="62" width="40" height="5" rx="1" fill="#374151"/>
      <rect x="14" y="70" width="172" height="1" fill="#d1d5db"/>
      <rect x="14" y="78" width="80" height="4" rx="1" fill="#4b5563"/>
      <rect x="14" y="86" width="60" height="3" rx="1" fill="#9ca3af"/>
      <rect x="14" y="94" width="160" height="3" rx="1" fill="#d1d5db"/>
      <rect x="14" y="100" width="150" height="3" rx="1" fill="#d1d5db"/>
      <rect x="14" y="106" width="155" height="3" rx="1" fill="#d1d5db"/>
      <rect x="14" y="118" width="40" height="5" rx="1" fill="#374151"/>
      <rect x="14" y="126" width="172" height="1" fill="#d1d5db"/>
      <rect x="14" y="134" width="80" height="4" rx="1" fill="#4b5563"/>
      <rect x="14" y="142" width="60" height="3" rx="1" fill="#9ca3af"/>
      <rect x="14" y="150" width="160" height="3" rx="1" fill="#d1d5db"/>
      <rect x="14" y="156" width="140" height="3" rx="1" fill="#d1d5db"/>
      <rect x="14" y="170" width="40" height="5" rx="1" fill="#374151"/>
      <rect x="14" y="178" width="172" height="1" fill="#d1d5db"/>
      <rect x="14" y="186" width="50" height="5" rx="2" fill="#e5e7eb"/>
      <rect x="72" y="186" width="50" height="5" rx="2" fill="#e5e7eb"/>
      <rect x="130" y="186" width="50" height="5" rx="2" fill="#e5e7eb"/>
      <rect x="14" y="196" width="40" height="5" rx="2" fill="#e5e7eb"/>
      <rect x="62" y="196" width="50" height="5" rx="2" fill="#e5e7eb"/>
    </svg>`
  },
  {
    id: 'ats-modern',
    name: 'ATS Modern',
    category: 'ats',
    isPremium: false,
    suitableFor: ['all'],
    sortOrder: 2,
    description: 'Dark header, ATS-safe body. Modern and professional.',
    bestFor: 'Tech, Finance, Operations',
    previewSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" width="200" height="260">
      <rect width="200" height="260" fill="#ffffff"/>
      <rect x="0" y="0" width="200" height="60" fill="#0f172a"/>
      <rect x="14" y="12" width="110" height="9" rx="2" fill="#f8fafc"/>
      <rect x="14" y="27" width="75" height="5" rx="1" fill="#3b82f6"/>
      <rect x="14" y="37" width="130" height="4" rx="1" fill="#64748b"/>
      <rect x="14" y="47" width="90" height="3" rx="1" fill="#475569"/>
      <rect x="14" y="72" width="50" height="6" rx="1" fill="#0f172a"/>
      <rect x="14" y="82" width="172" height="1" fill="#3b82f6"/>
      <rect x="14" y="90" width="90" height="4" rx="1" fill="#1e293b"/>
      <rect x="14" y="98" width="65" height="3" rx="1" fill="#94a3b8"/>
      <rect x="14" y="106" width="160" height="3" rx="1" fill="#cbd5e1"/>
      <rect x="14" y="112" width="150" height="3" rx="1" fill="#cbd5e1"/>
      <rect x="14" y="126" width="50" height="6" rx="1" fill="#0f172a"/>
      <rect x="14" y="136" width="172" height="1" fill="#3b82f6"/>
      <rect x="14" y="144" width="90" height="4" rx="1" fill="#1e293b"/>
      <rect x="14" y="152" width="65" height="3" rx="1" fill="#94a3b8"/>
      <rect x="14" y="160" width="155" height="3" rx="1" fill="#cbd5e1"/>
      <rect x="14" y="166" width="140" height="3" rx="1" fill="#cbd5e1"/>
      <rect x="14" y="180" width="50" height="6" rx="1" fill="#0f172a"/>
      <rect x="14" y="190" width="172" height="1" fill="#3b82f6"/>
      <rect x="14" y="198" width="48" height="6" rx="3" fill="#dbeafe"/>
      <rect x="68" y="198" width="48" height="6" rx="3" fill="#dbeafe"/>
      <rect x="122" y="198" width="48" height="6" rx="3" fill="#dbeafe"/>
      <rect x="14" y="210" width="38" height="6" rx="3" fill="#dbeafe"/>
      <rect x="58" y="210" width="55" height="6" rx="3" fill="#dbeafe"/>
    </svg>`
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    category: 'corporate',
    isPremium: true,
    suitableFor: ['finance', 'banking', 'legal', 'hr'],
    sortOrder: 3,
    description: 'Blue sidebar with skill bars. Executive corporate feel.',
    bestFor: 'Finance, Banking, Legal, HR',
    previewSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" width="200" height="260">
      <rect width="200" height="260" fill="#ffffff"/>
      <rect x="0" y="0" width="65" height="260" fill="#1e3a5f"/>
      <rect x="8" y="16" width="48" height="48" rx="24" fill="#2d5282"/>
      <rect x="14" y="74" width="36" height="5" rx="1" fill="#90cdf4"/>
      <rect x="10" y="84" width="44" height="3" rx="1" fill="#63b3ed" opacity="0.7"/>
      <rect x="10" y="92" width="44" height="3" rx="1" fill="#63b3ed" opacity="0.5"/>
      <rect x="10" y="108" width="30" height="4" rx="1" fill="#90cdf4"/>
      <rect x="10" y="116" width="44" height="4" rx="2" fill="#2d5282"/>
      <rect x="10" y="116" width="38" height="4" rx="2" fill="#3b82f6"/>
      <rect x="10" y="124" width="44" height="4" rx="2" fill="#2d5282"/>
      <rect x="10" y="124" width="28" height="4" rx="2" fill="#3b82f6"/>
      <rect x="10" y="132" width="44" height="4" rx="2" fill="#2d5282"/>
      <rect x="10" y="132" width="40" height="4" rx="2" fill="#3b82f6"/>
      <rect x="10" y="148" width="30" height="4" rx="1" fill="#90cdf4"/>
      <rect x="10" y="156" width="44" height="3" rx="1" fill="#63b3ed" opacity="0.7"/>
      <rect x="10" y="164" width="36" height="3" rx="1" fill="#63b3ed" opacity="0.5"/>
      <rect x="75" y="14" width="110" height="9" rx="2" fill="#1e3a5f"/>
      <rect x="75" y="28" width="80" height="5" rx="1" fill="#2d5282"/>
      <rect x="75" y="38" width="100" height="3" rx="1" fill="#a0aec0"/>
      <rect x="75" y="58" width="40" height="5" rx="1" fill="#1e3a5f"/>
      <rect x="75" y="66" width="110" height="1" fill="#bfdbfe"/>
      <rect x="75" y="74" width="85" height="4" rx="1" fill="#2d3748"/>
      <rect x="75" y="82" width="60" height="3" rx="1" fill="#718096"/>
      <rect x="75" y="90" width="108" height="3" rx="1" fill="#e2e8f0"/>
      <rect x="75" y="96" width="100" height="3" rx="1" fill="#e2e8f0"/>
      <rect x="75" y="112" width="40" height="5" rx="1" fill="#1e3a5f"/>
      <rect x="75" y="120" width="110" height="1" fill="#bfdbfe"/>
      <rect x="75" y="128" width="85" height="4" rx="1" fill="#2d3748"/>
      <rect x="75" y="136" width="60" height="3" rx="1" fill="#718096"/>
      <rect x="75" y="144" width="108" height="3" rx="1" fill="#e2e8f0"/>
      <rect x="75" y="150" width="95" height="3" rx="1" fill="#e2e8f0"/>
    </svg>`
  },
  {
    id: 'tech-dark',
    name: 'Tech Dark',
    category: 'tech',
    isPremium: true,
    suitableFor: ['software', 'engineering', 'data', 'devops'],
    sortOrder: 4,
    description: 'Dark theme with green accents. For developers.',
    bestFor: 'Software, Engineering, DevOps',
    previewSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" width="200" height="260">
      <rect width="200" height="260" fill="#0d1117"/>
      <rect x="0" y="0" width="200" height="55" fill="#161b22"/>
      <rect x="14" y="12" width="105" height="9" rx="2" fill="#58a6ff"/>
      <rect x="14" y="26" width="75" height="5" rx="1" fill="#3fb950"/>
      <rect x="14" y="36" width="120" height="4" rx="1" fill="#8b949e"/>
      <rect x="14" y="44" width="90" height="3" rx="1" fill="#6e7681"/>
      <rect x="14" y="66" width="45" height="5" rx="1" fill="#58a6ff"/>
      <rect x="14" y="74" width="172" height="1" fill="#21262d"/>
      <rect x="14" y="82" width="90" height="4" rx="1" fill="#e6edf3"/>
      <rect x="14" y="90" width="65" height="3" rx="1" fill="#3fb950"/>
      <rect x="14" y="98" width="8" height="3" rx="1" fill="#3fb950"/>
      <rect x="26" y="98" width="148" height="3" rx="1" fill="#8b949e"/>
      <rect x="14" y="104" width="8" height="3" rx="1" fill="#3fb950"/>
      <rect x="26" y="104" width="135" height="3" rx="1" fill="#8b949e"/>
      <rect x="14" y="110" width="8" height="3" rx="1" fill="#3fb950"/>
      <rect x="26" y="110" width="142" height="3" rx="1" fill="#8b949e"/>
      <rect x="14" y="124" width="45" height="5" rx="1" fill="#58a6ff"/>
      <rect x="14" y="132" width="172" height="1" fill="#21262d"/>
      <rect x="14" y="140" width="90" height="4" rx="1" fill="#e6edf3"/>
      <rect x="14" y="148" width="65" height="3" rx="1" fill="#3fb950"/>
      <rect x="14" y="156" width="8" height="3" rx="1" fill="#3fb950"/>
      <rect x="26" y="156" width="148" height="3" rx="1" fill="#8b949e"/>
      <rect x="14" y="162" width="8" height="3" rx="1" fill="#3fb950"/>
      <rect x="26" y="162" width="130" height="3" rx="1" fill="#8b949e"/>
      <rect x="14" y="176" width="45" height="5" rx="1" fill="#58a6ff"/>
      <rect x="14" y="184" width="172" height="1" fill="#21262d"/>
      <rect x="14" y="192" width="45" height="6" rx="3" fill="#1f3a24"/>
      <rect x="65" y="192" width="45" height="6" rx="3" fill="#1f3a24"/>
      <rect x="116" y="192" width="45" height="6" rx="3" fill="#1f3a24"/>
      <text x="14" y="198" font-size="4" fill="#3fb950" font-family="monospace">Python</text>
      <text x="65" y="198" font-size="4" fill="#3fb950" font-family="monospace">Node.js</text>
      <text x="116" y="198" font-size="4" fill="#3fb950" font-family="monospace">Docker</text>
    </svg>`
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    category: 'creative',
    isPremium: true,
    suitableFor: ['design', 'marketing', 'media', 'content'],
    sortOrder: 5,
    description: 'Purple gradient header with colorful layout.',
    bestFor: 'Design, Marketing, Media',
    previewSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" width="200" height="260">
      <rect width="200" height="260" fill="#faf5ff"/>
      <defs>
        <linearGradient id="purp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#7c3aed"/>
          <stop offset="100%" style="stop-color:#db2777"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="65" fill="url(#purp)"/>
      <rect x="14" y="12" width="105" height="10" rx="2" fill="#ffffff"/>
      <rect x="14" y="28" width="80" height="5" rx="1" fill="#e9d5ff"/>
      <rect x="14" y="38" width="120" height="4" rx="1" fill="#ddd6fe"/>
      <rect x="14" y="47" width="90" height="4" rx="1" fill="#c4b5fd" opacity="0.8"/>
      <rect x="14" y="78" width="50" height="6" rx="1" fill="#7c3aed"/>
      <rect x="14" y="88" width="172" height="2" fill="url(#purp)" opacity="0.4"/>
      <rect x="14" y="96" width="90" height="5" rx="1" fill="#1f2937"/>
      <rect x="14" y="105" width="65" height="3" rx="1" fill="#db2777"/>
      <rect x="14" y="113" width="160" height="3" rx="1" fill="#d1d5db"/>
      <rect x="14" y="119" width="145" height="3" rx="1" fill="#d1d5db"/>
      <rect x="14" y="135" width="50" height="6" rx="1" fill="#7c3aed"/>
      <rect x="14" y="145" width="172" height="2" fill="url(#purp)" opacity="0.4"/>
      <rect x="14" y="153" width="90" height="5" rx="1" fill="#1f2937"/>
      <rect x="14" y="162" width="65" height="3" rx="1" fill="#db2777"/>
      <rect x="14" y="170" width="155" height="3" rx="1" fill="#d1d5db"/>
      <rect x="14" y="186" width="50" height="6" rx="1" fill="#7c3aed"/>
      <rect x="14" y="196" width="172" height="2" fill="url(#purp)" opacity="0.4"/>
      <rect x="14" y="204" width="48" height="7" rx="3" fill="#ede9fe"/>
      <rect x="68" y="204" width="48" height="7" rx="3" fill="#fce7f3"/>
      <rect x="122" y="204" width="48" height="7" rx="3" fill="#ede9fe"/>
    </svg>`
  },
  {
    id: 'fresher-simple',
    name: 'Fresher Simple',
    category: 'fresher',
    isPremium: false,
    suitableFor: ['fresher', 'student', 'intern'],
    sortOrder: 6,
    description: 'Education-first layout. Perfect for fresh graduates.',
    bestFor: 'Students, Fresh Graduates',
    previewSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" width="200" height="260">
      <rect width="200" height="260" fill="#ffffff"/>
      <rect x="0" y="0" width="200" height="5" fill="#2563eb"/>
      <rect x="14" y="18" width="115" height="10" rx="2" fill="#1e3a8a"/>
      <rect x="14" y="33" width="80" height="5" rx="1" fill="#2563eb"/>
      <rect x="14" y="43" width="140" height="3" rx="1" fill="#93c5fd"/>
      <rect x="14" y="58" width="45" height="5" rx="1" fill="#1e3a8a"/>
      <rect x="14" y="66" width="172" height="1.5" fill="#bfdbfe"/>
      <rect x="14" y="74" width="90" height="4" rx="1" fill="#1e40af"/>
      <rect x="14" y="82" width="65" height="3" rx="1" fill="#60a5fa"/>
      <rect x="14" y="90" width="40" height="3" rx="1" fill="#93c5fd"/>
      <rect x="14" y="104" width="45" height="5" rx="1" fill="#1e3a8a"/>
      <rect x="14" y="112" width="172" height="1.5" fill="#bfdbfe"/>
      <rect x="14" y="120" width="90" height="4" rx="1" fill="#1e40af"/>
      <rect x="14" y="128" width="65" height="3" rx="1" fill="#60a5fa"/>
      <rect x="14" y="136" width="160" height="3" rx="1" fill="#e2e8f0"/>
      <rect x="14" y="142" width="145" height="3" rx="1" fill="#e2e8f0"/>
      <rect x="14" y="157" width="45" height="5" rx="1" fill="#1e3a8a"/>
      <rect x="14" y="165" width="172" height="1.5" fill="#bfdbfe"/>
      <rect x="14" y="173" width="50" height="6" rx="3" fill="#dbeafe"/>
      <rect x="70" y="173" width="55" height="6" rx="3" fill="#dbeafe"/>
      <rect x="131" y="173" width="45" height="6" rx="3" fill="#dbeafe"/>
      <rect x="14" y="185" width="45" height="6" rx="3" fill="#dbeafe"/>
      <rect x="65" y="185" width="55" height="6" rx="3" fill="#dbeafe"/>
      <rect x="14" y="200" width="45" height="5" rx="1" fill="#1e3a8a"/>
      <rect x="14" y="208" width="172" height="1.5" fill="#bfdbfe"/>
      <rect x="14" y="216" width="160" height="3" rx="1" fill="#e2e8f0"/>
      <rect x="14" y="222" width="140" height="3" rx="1" fill="#e2e8f0"/>
    </svg>`
  },
  {
    id: 'marketing-bold',
    name: 'Marketing Bold',
    category: 'marketing',
    isPremium: true,
    suitableFor: ['marketing', 'advertising', 'seo', 'social media'],
    sortOrder: 7,
    description: 'Red accents, metrics-focused. For marketing pros.',
    bestFor: 'Marketing, Advertising, SEO',
    previewSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" width="200" height="260">
      <rect width="200" height="260" fill="#fff5f5"/>
      <rect x="0" y="0" width="200" height="8" fill="#dc2626"/>
      <rect x="14" y="22" width="120" height="12" rx="2" fill="#111827"/>
      <rect x="14" y="40" width="85" height="6" rx="1" fill="#dc2626"/>
      <rect x="14" y="52" width="140" height="4" rx="1" fill="#6b7280"/>
      <rect x="14" y="72" width="55" height="7" rx="1" fill="#111827"/>
      <rect x="14" y="83" width="172" height="2" fill="#dc2626"/>
      <rect x="14" y="92" width="90" height="5" rx="1" fill="#111827"/>
      <rect x="14" y="101" width="65" height="3" rx="1" fill="#dc2626"/>
      <rect x="10" y="109" width="4" height="4" fill="#dc2626"/>
      <rect x="18" y="109" width="155" height="3" rx="1" fill="#6b7280"/>
      <rect x="10" y="116" width="4" height="4" fill="#dc2626"/>
      <rect x="18" y="116" width="145" height="3" rx="1" fill="#6b7280"/>
      <rect x="10" y="123" width="4" height="4" fill="#dc2626"/>
      <rect x="18" y="123" width="150" height="3" rx="1" fill="#6b7280"/>
      <rect x="14" y="136" width="55" height="7" rx="1" fill="#111827"/>
      <rect x="14" y="147" width="172" height="2" fill="#dc2626"/>
      <rect x="14" y="156" width="90" height="5" rx="1" fill="#111827"/>
      <rect x="14" y="165" width="65" height="3" rx="1" fill="#dc2626"/>
      <rect x="10" y="173" width="4" height="4" fill="#dc2626"/>
      <rect x="18" y="173" width="150" height="3" rx="1" fill="#6b7280"/>
      <rect x="14" y="188" width="55" height="7" rx="1" fill="#111827"/>
      <rect x="14" y="199" width="172" height="2" fill="#dc2626"/>
      <rect x="14" y="207" width="50" height="8" rx="2" fill="#fee2e2"/>
      <rect x="70" y="207" width="55" height="8" rx="2" fill="#fee2e2"/>
      <rect x="131" y="207" width="45" height="8" rx="2" fill="#fee2e2"/>
    </svg>`
  },
  {
    id: 'sales-results',
    name: 'Sales Results',
    category: 'sales',
    isPremium: true,
    suitableFor: ['sales', 'business development', 'account management'],
    sortOrder: 8,
    description: 'Metrics-heavy layout with quota/achievement callouts.',
    bestFor: 'Sales, Business Dev, Account Mgmt',
    previewSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" width="200" height="260">
      <rect width="200" height="260" fill="#fffbeb"/>
      <rect x="0" y="0" width="200" height="55" fill="#92400e"/>
      <rect x="14" y="11" width="110" height="9" rx="2" fill="#fef3c7"/>
      <rect x="14" y="26" width="80" height="5" rx="1" fill="#fcd34d"/>
      <rect x="14" y="36" width="115" height="3" rx="1" fill="#d97706" opacity="0.7"/>
      <rect x="14" y="44" width="90" height="3" rx="1" fill="#d97706" opacity="0.5"/>
      <rect x="14" y="68" width="55" height="6" rx="1" fill="#92400e"/>
      <rect x="14" y="78" width="172" height="2" fill="#fcd34d"/>
      <rect x="14" y="87" width="90" height="4" rx="1" fill="#1c1917"/>
      <rect x="14" y="95" width="65" height="3" rx="1" fill="#d97706"/>
      <rect x="10" y="102" width="4" height="4" fill="#f59e0b" rx="1"/>
      <rect x="18" y="102" width="155" height="3" rx="1" fill="#78716c"/>
      <rect x="10" y="109" width="4" height="4" fill="#f59e0b" rx="1"/>
      <rect x="18" y="109" width="140" height="3" rx="1" fill="#78716c"/>
      <rect x="14" y="120" width="172" height="14" rx="3" fill="#fef3c7" stroke="#fcd34d" stroke-width="1"/>
      <rect x="20" y="124" width="6" height="6" rx="1" fill="#f59e0b"/>
      <rect x="32" y="126" width="80" height="3" rx="1" fill="#92400e"/>
      <rect x="14" y="143" width="55" height="6" rx="1" fill="#92400e"/>
      <rect x="14" y="153" width="172" height="2" fill="#fcd34d"/>
      <rect x="14" y="162" width="90" height="4" rx="1" fill="#1c1917"/>
      <rect x="14" y="170" width="65" height="3" rx="1" fill="#d97706"/>
      <rect x="10" y="177" width="4" height="4" fill="#f59e0b" rx="1"/>
      <rect x="18" y="177" width="148" height="3" rx="1" fill="#78716c"/>
      <rect x="14" y="192" width="55" height="6" rx="1" fill="#92400e"/>
      <rect x="14" y="202" width="172" height="2" fill="#fcd34d"/>
      <rect x="14" y="210" width="48" height="8" rx="2" fill="#fef3c7"/>
      <rect x="68" y="210" width="48" height="8" rx="2" fill="#fef3c7"/>
      <rect x="122" y="210" width="48" height="8" rx="2" fill="#fef3c7"/>
    </svg>`
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    category: 'corporate',
    isPremium: true,
    suitableFor: ['executive', 'director', 'manager', 'vp', 'cto', 'ceo'],
    sortOrder: 9,
    description: 'Minimal, high whitespace. For senior professionals.',
    bestFor: 'Executives, Directors, VPs',
    previewSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" width="200" height="260">
      <rect width="200" height="260" fill="#ffffff"/>
      <rect x="0" y="0" width="4" height="260" fill="#1a1a2e"/>
      <rect x="16" y="20" width="120" height="11" rx="1" fill="#1a1a2e"/>
      <rect x="16" y="36" width="80" height="5" rx="1" fill="#6b7280"/>
      <rect x="16" y="47" width="150" height="1" fill="#e5e7eb"/>
      <rect x="16" y="54" width="130" height="3" rx="1" fill="#9ca3af"/>
      <rect x="16" y="62" width="120" height="3" rx="1" fill="#9ca3af"/>
      <rect x="16" y="80" width="50" height="6" rx="1" fill="#1a1a2e"/>
      <rect x="16" y="90" width="172" height="0.5" fill="#d1d5db"/>
      <rect x="16" y="98" width="90" height="4" rx="1" fill="#374151"/>
      <rect x="16" y="106" width="65" height="3" rx="1" fill="#9ca3af"/>
      <rect x="16" y="114" width="162" height="3" rx="1" fill="#e5e7eb"/>
      <rect x="16" y="120" width="150" height="3" rx="1" fill="#e5e7eb"/>
      <rect x="16" y="126" width="155" height="3" rx="1" fill="#e5e7eb"/>
      <rect x="16" y="142" width="50" height="6" rx="1" fill="#1a1a2e"/>
      <rect x="16" y="152" width="172" height="0.5" fill="#d1d5db"/>
      <rect x="16" y="160" width="90" height="4" rx="1" fill="#374151"/>
      <rect x="16" y="168" width="65" height="3" rx="1" fill="#9ca3af"/>
      <rect x="16" y="176" width="158" height="3" rx="1" fill="#e5e7eb"/>
      <rect x="16" y="182" width="145" height="3" rx="1" fill="#e5e7eb"/>
      <rect x="16" y="198" width="50" height="6" rx="1" fill="#1a1a2e"/>
      <rect x="16" y="208" width="172" height="0.5" fill="#d1d5db"/>
      <rect x="16" y="216" width="50" height="5" rx="1" fill="#e5e7eb"/>
      <rect x="72" y="216" width="50" height="5" rx="1" fill="#e5e7eb"/>
      <rect x="128" y="216" width="50" height="5" rx="1" fill="#e5e7eb"/>
    </svg>`
  },
  {
    id: 'global-minimal',
    name: 'Global Minimal',
    category: 'modern',
    isPremium: false,
    suitableFor: ['all', 'international'],
    sortOrder: 10,
    description: 'Ultra-clean international standard. Works everywhere.',
    bestFor: 'All industries, International',
    previewSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" width="200" height="260">
      <rect width="200" height="260" fill="#ffffff"/>
      <rect x="0" y="0" width="200" height="3" fill="#000000"/>
      <rect x="14" y="20" width="115" height="10" rx="1" fill="#111827"/>
      <rect x="14" y="35" width="75" height="5" rx="1" fill="#374151"/>
      <rect x="14" y="45" width="140" height="3" rx="1" fill="#9ca3af"/>
      <rect x="0" y="56" width="200" height="1" fill="#e5e7eb"/>
      <rect x="14" y="66" width="40" height="5" rx="1" fill="#111827"/>
      <rect x="14" y="76" width="172" height="0.5" fill="#e5e7eb"/>
      <rect x="14" y="83" width="90" height="4" rx="1" fill="#374151"/>
      <rect x="14" y="91" width="65" height="3" rx="1" fill="#9ca3af"/>
      <rect x="14" y="99" width="162" height="3" rx="1" fill="#e5e7eb"/>
      <rect x="14" y="105" width="148" height="3" rx="1" fill="#e5e7eb"/>
      <rect x="14" y="111" width="155" height="3" rx="1" fill="#e5e7eb"/>
      <rect x="14" y="126" width="40" height="5" rx="1" fill="#111827"/>
      <rect x="14" y="136" width="172" height="0.5" fill="#e5e7eb"/>
      <rect x="14" y="143" width="90" height="4" rx="1" fill="#374151"/>
      <rect x="14" y="151" width="65" height="3" rx="1" fill="#9ca3af"/>
      <rect x="14" y="159" width="158" height="3" rx="1" fill="#e5e7eb"/>
      <rect x="14" y="165" width="140" height="3" rx="1" fill="#e5e7eb"/>
      <rect x="14" y="180" width="40" height="5" rx="1" fill="#111827"/>
      <rect x="14" y="190" width="172" height="0.5" fill="#e5e7eb"/>
      <rect x="14" y="197" width="50" height="6" rx="1" fill="#f3f4f6"/>
      <rect x="70" y="197" width="55" height="6" rx="1" fill="#f3f4f6"/>
      <rect x="131" y="197" width="45" height="6" rx="1" fill="#f3f4f6"/>
      <rect x="14" y="208" width="42" height="6" rx="1" fill="#f3f4f6"/>
      <rect x="62" y="208" width="55" height="6" rx="1" fill="#f3f4f6"/>
    </svg>`
  }
];

// Encode SVG as data URL
function svgToDataUrl(svg) {
  const encoded = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${encoded}`;
}

// ── Routes ────────────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  const { category, role } = req.query;
  let list = TEMPLATES;

  if (category) list = list.filter(t => t.category === category);
  if (role) {
    list = list.filter(t =>
      t.suitableFor.includes('all') ||
      t.suitableFor.some(s => s.toLowerCase().includes(role.toLowerCase()))
    );
  }

  // Inject SVG data URL as previewUrl so frontend can use it directly as <img src>
  const result = list.map(t => ({
    ...t,
    previewUrl: svgToDataUrl(t.previewSvg),
    previewSvg: undefined   // strip raw SVG from payload
  }));

  res.json(result);
});

router.get('/:id', (req, res) => {
  const t = TEMPLATES.find(t => t.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Template not found' });
  res.json({ ...t, previewUrl: svgToDataUrl(t.previewSvg), previewSvg: undefined });
});

module.exports = router;
module.exports.TEMPLATES = TEMPLATES;
