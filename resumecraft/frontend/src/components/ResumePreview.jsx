export default function ResumePreview({ resumeData, scale = 1 }) {
  const d = resumeData || {};
  const personal = d.personal || {};
  const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean);

  return (
    <div className="resume-preview bg-white" style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: `${100 / scale}%` }}>
      <div style={{ padding: '30px', maxWidth: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '12px', marginBottom: '14px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#111' }}>{personal.name || 'Your Name'}</h1>
          {contactParts.length > 0 && (
            <p style={{ fontSize: '10px', color: '#555', marginTop: '4px' }}>{contactParts.join(' | ')}</p>
          )}
          {(personal.linkedin || personal.portfolio) && (
            <p style={{ fontSize: '10px', color: '#555' }}>
              {[personal.linkedin, personal.portfolio].filter(Boolean).join(' | ')}
            </p>
          )}
        </div>

        {/* Summary */}
        {d.summary && (
          <div className="section">
            <div className="section-title">Professional Summary</div>
            <p style={{ fontSize: '11px', lineHeight: '1.5' }}>{d.summary}</p>
          </div>
        )}

        {/* Experience */}
        {d.experience?.length > 0 && (
          <div className="section">
            <div className="section-title">Work Experience</div>
            {d.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="job-title">{exp.title}</span>
                    {exp.company && <span style={{ fontStyle: 'italic' }}> — {exp.company}</span>}
                    {exp.location && <span style={{ fontSize: '10px', color: '#666' }}>, {exp.location}</span>}
                  </div>
                  <span style={{ fontSize: '10px', color: '#666', whiteSpace: 'nowrap' }}>
                    {exp.start}{exp.end ? ` – ${exp.end}` : exp.current ? ' – Present' : ''}
                  </span>
                </div>
                {exp.bullets?.length > 0 && (
                  <ul style={{ paddingLeft: '14px', marginTop: '3px' }}>
                    {exp.bullets.map((b, j) => <li key={j} style={{ fontSize: '10px', marginBottom: '1px' }}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {d.education?.length > 0 && (
          <div className="section">
            <div className="section-title">Education</div>
            {d.education.map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div>
                  <strong style={{ fontSize: '11px' }}>{edu.degree}</strong>
                  {edu.institution && <span style={{ fontSize: '10px' }}> — {edu.institution}</span>}
                  {edu.gpa && <span style={{ fontSize: '10px', color: '#666' }}> | GPA: {edu.gpa}</span>}
                </div>
                <span style={{ fontSize: '10px', color: '#666' }}>{edu.year}</span>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {(d.skills?.technical?.length > 0 || d.skills?.tools?.length > 0 || d.skills?.soft?.length > 0) && (
          <div className="section">
            <div className="section-title">Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {[...(d.skills?.technical || []), ...(d.skills?.tools || []), ...(d.skills?.soft || [])].map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {d.projects?.length > 0 && (
          <div className="section">
            <div className="section-title">Projects</div>
            {d.projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <strong style={{ fontSize: '11px' }}>{proj.name}</strong>
                {proj.tech?.length > 0 && <span style={{ fontSize: '10px', color: '#555' }}> | {proj.tech.join(', ')}</span>}
                {proj.description && <p style={{ fontSize: '10px', marginTop: '2px' }}>{proj.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {d.achievements?.length > 0 && (
          <div className="section">
            <div className="section-title">Achievements</div>
            <ul style={{ paddingLeft: '14px' }}>
              {d.achievements.map((a, i) => <li key={i} style={{ fontSize: '10px', marginBottom: '2px' }}>{a}</li>)}
            </ul>
          </div>
        )}

        {/* Certifications */}
        {d.certifications?.length > 0 && (
          <div className="section">
            <div className="section-title">Certifications</div>
            {d.certifications.map((c, i) => (
              <div key={i} style={{ fontSize: '10px', marginBottom: '3px' }}>
                <strong>{c.name}</strong>{c.issuer ? ` — ${c.issuer}` : ''}{c.year ? `, ${c.year}` : ''}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
