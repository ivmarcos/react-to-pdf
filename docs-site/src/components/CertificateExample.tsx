import { useEffect, useState } from 'react';

export default function CertificateExample() {
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
      console.error('[CertificateExample] Failed to load react-to-pdf:', error);
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

  return <CertificateContent usePDF={usePDF} />;
}

function CertificateContent({ usePDF }: { usePDF: any }) {
  const { targetRef, toPDF } = usePDF({
    filename: 'certificate.pdf',
    page: {
      format: 'a4',
      orientation: 'landscape',
      margin: 0
    }
  });

  const certificateData = {
    recipientName: 'John Smith',
    courseName: 'Advanced React Development',
    completionDate: 'January 15, 2024',
    instructorName: 'Jane Doe',
    certificateId: 'CERT-2024-001'
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
          📥 Download Certificate PDF
        </button>
      </div>

      <div ref={targetRef} style={{
        backgroundColor: 'white',
        padding: '60px 80px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontFamily: 'Georgia, serif',
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative',
        minHeight: '600px',
        background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)'
      }}>
        {/* Decorative border */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          border: '3px solid #0ea5e9',
          borderRadius: '4px'
        }}>
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            bottom: '10px',
            border: '1px solid #64748b'
          }} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', textAlign: 'center', paddingTop: '40px' }}>
          <h1 style={{
            margin: '0 0 20px 0',
            color: '#0ea5e9',
            fontSize: '48px',
            fontWeight: '700',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            Certificate
          </h1>

          <p style={{
            margin: '0 0 40px 0',
            color: '#64748b',
            fontSize: '18px',
            fontStyle: 'italic',
            letterSpacing: '1px'
          }}>
            of Achievement
          </p>

          <p style={{
            margin: '0 0 10px 0',
            color: '#475569',
            fontSize: '16px',
            letterSpacing: '0.5px'
          }}>
            This is to certify that
          </p>

          <h2 style={{
            margin: '20px 0 40px 0',
            color: '#0f172a',
            fontSize: '42px',
            fontWeight: '700',
            borderBottom: '2px solid #0ea5e9',
            paddingBottom: '10px',
            display: 'inline-block'
          }}>
            {certificateData.recipientName}
          </h2>

          <p style={{
            margin: '0 0 10px 0',
            color: '#475569',
            fontSize: '16px',
            letterSpacing: '0.5px'
          }}>
            has successfully completed
          </p>

          <h3 style={{
            margin: '20px 0 40px 0',
            color: '#0ea5e9',
            fontSize: '32px',
            fontWeight: '600'
          }}>
            {certificateData.courseName}
          </h3>

          <p style={{
            margin: '0 0 60px 0',
            color: '#64748b',
            fontSize: '16px',
            fontStyle: 'italic'
          }}>
            Completed on {certificateData.completionDate}
          </p>

          {/* Signature section */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '60px',
            paddingTop: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                borderTop: '2px solid #0f172a',
                width: '200px',
                margin: '0 auto 10px auto'
              }} />
              <p style={{ margin: '5px 0', color: '#0f172a', fontSize: '16px', fontWeight: '600' }}>
                {certificateData.instructorName}
              </p>
              <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}>
                Course Instructor
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                borderTop: '2px solid #0f172a',
                width: '200px',
                margin: '0 auto 10px auto'
              }} />
              <p style={{ margin: '5px 0', color: '#0f172a', fontSize: '16px', fontWeight: '600' }}>
                {certificateData.completionDate}
              </p>
              <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}>
                Date
              </p>
            </div>
          </div>

          {/* Certificate ID */}
          <p style={{
            marginTop: '40px',
            color: '#94a3b8',
            fontSize: '12px',
            letterSpacing: '1px'
          }}>
            Certificate ID: {certificateData.certificateId}
          </p>
        </div>
      </div>
    </div>
  );
}
