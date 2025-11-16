import { useEffect, useState } from 'react';

export default function ResumeExample() {
  const [mounted, setMounted] = useState(false);
  const [usePDF, setUsePDF] = useState<any>(null);

  useEffect(() => {
    // Only import and initialize on client side
    import('react-to-pdf').then((module) => {
      const pkg = module as any;
      const usePDFFunc = pkg.usePDF || pkg.default?.usePDF;
      setUsePDF(() => usePDFFunc);
      setMounted(true);
    }).catch((error) => {
      console.error('[ResumeExample] Failed to load react-to-pdf:', error);
    });
  }, []);

  if (!mounted || !usePDF) {
    return (
      <div style={{
        padding: '30px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginTop: '30px',
        marginBottom: '30px',
        textAlign: 'center',
        color: '#64748b'
      }}>
        Loading example...
      </div>
    );
  }

  return <ResumeContent usePDF={usePDF} />;
}

function ResumeContent({ usePDF }: { usePDF: any }) {
  const { targetRef, toPDF } = usePDF({
    filename: 'resume.pdf',
    page: {
      format: 'a4',
      margin: 10
    }
  });

  const resumeData = {
    name: 'Sarah Johnson',
    title: 'Senior Full Stack Developer',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/sarahjohnson',
    summary: 'Experienced full stack developer with 8+ years building scalable web applications. Passionate about creating elegant solutions to complex problems and mentoring junior developers.',
    experience: [
      {
        company: 'Tech Solutions Inc.',
        position: 'Senior Full Stack Developer',
        period: '2020 - Present',
        achievements: [
          'Led development of microservices architecture serving 2M+ users',
          'Reduced API response time by 40% through optimization',
          'Mentored team of 5 junior developers'
        ]
      },
      {
        company: 'Digital Innovations',
        position: 'Full Stack Developer',
        period: '2017 - 2020',
        achievements: [
          'Built and deployed 15+ web applications using React and Node.js',
          'Implemented CI/CD pipeline reducing deployment time by 60%',
          'Collaborated with design team on UI/UX improvements'
        ]
      }
    ],
    education: [
      {
        degree: 'B.S. Computer Science',
        school: 'University of California',
        year: '2016'
      }
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Git']
  };

  return (
    <div style={{ marginTop: '30px', marginBottom: '30px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          onClick={() => toPDF()}
          style={{
            padding: '12px 32px',
            backgroundColor: '#0ea5e9',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 4px 6px rgba(14, 165, 233, 0.3)'
          }}
        >
          📥 Download Resume PDF
        </button>
      </div>

      <div ref={targetRef} style={{
        backgroundColor: 'white',
        padding: '40px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        lineHeight: '1.6'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          paddingBottom: '20px',
          marginBottom: '30px',
          borderBottom: '2px solid #0ea5e9'
        }}>
          <h1 style={{
            margin: '0 0 5px 0',
            color: '#0f172a',
            fontSize: '32px',
            fontWeight: '700'
          }}>
            {resumeData.name}
          </h1>
          <p style={{
            margin: '0 0 15px 0',
            color: '#0ea5e9',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            {resumeData.title}
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            fontSize: '13px',
            color: '#64748b'
          }}>
            <span>{resumeData.email}</span>
            <span>•</span>
            <span>{resumeData.phone}</span>
            <span>•</span>
            <span>{resumeData.location}</span>
            <span>•</span>
            <span>{resumeData.linkedin}</span>
          </div>
        </div>

        {/* Summary */}
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{
            margin: '0 0 10px 0',
            color: '#0f172a',
            fontSize: '18px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Professional Summary
          </h2>
          <p style={{
            margin: '0',
            color: '#475569',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            {resumeData.summary}
          </p>
        </div>

        {/* Experience */}
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{
            margin: '0 0 15px 0',
            color: '#0f172a',
            fontSize: '18px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Experience
          </h2>
          {resumeData.experience.map((job, i) => (
            <div key={i} style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '5px'
              }}>
                <h3 style={{
                  margin: '0',
                  color: '#0f172a',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  {job.position}
                </h3>
                <span style={{
                  color: '#64748b',
                  fontSize: '13px',
                  fontStyle: 'italic'
                }}>
                  {job.period}
                </span>
              </div>
              <p style={{
                margin: '0 0 8px 0',
                color: '#0ea5e9',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {job.company}
              </p>
              <ul style={{
                margin: '0',
                paddingLeft: '20px',
                color: '#475569',
                fontSize: '14px'
              }}>
                {job.achievements.map((achievement, j) => (
                  <li key={j} style={{ marginBottom: '4px' }}>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education */}
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{
            margin: '0 0 15px 0',
            color: '#0f172a',
            fontSize: '18px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Education
          </h2>
          {resumeData.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <h3 style={{
                  margin: '0',
                  color: '#0f172a',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  {edu.degree}
                </h3>
                <span style={{
                  color: '#64748b',
                  fontSize: '13px',
                  fontStyle: 'italic'
                }}>
                  {edu.year}
                </span>
              </div>
              <p style={{
                margin: '0',
                color: '#0ea5e9',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {edu.school}
              </p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div>
          <h2 style={{
            margin: '0 0 15px 0',
            color: '#0f172a',
            fontSize: '18px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Skills
          </h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {resumeData.skills.map((skill, i) => (
              <span key={i} style={{
                padding: '6px 14px',
                backgroundColor: '#f1f5f9',
                color: '#0f172a',
                fontSize: '13px',
                fontWeight: '500',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
