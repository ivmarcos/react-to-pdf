import { useEffect, useState } from 'react';

export default function FormExample() {
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
      console.error('[FormExample] Failed to load react-to-pdf:', error);
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

  return <FormContent usePDF={usePDF} />;
}

function FormContent({ usePDF }: { usePDF: any }) {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    country: 'United States',
    company: 'Tech Solutions Inc.',
    position: 'Software Engineer',
    department: 'Engineering',
    startDate: '2024-01-15',
    employmentType: 'Full-time',
    agree: true
  });

  const { targetRef, toPDF } = usePDF({
    filename: 'employment-form.pdf',
    page: {
      format: 'a4',
      margin: 10
    }
  });

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
          📥 Download Form PDF
        </button>
      </div>

      <div ref={targetRef} style={{
        backgroundColor: 'white',
        padding: '40px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          paddingBottom: '20px',
          marginBottom: '30px',
          borderBottom: '3px solid #0ea5e9'
        }}>
          <h1 style={{
            margin: '0 0 5px 0',
            color: '#0f172a',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            Employment Application Form
          </h1>
          <p style={{
            margin: '0',
            color: '#64748b',
            fontSize: '14px'
          }}>
            Please review the information below
          </p>
        </div>

        {/* Personal Information */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{
            margin: '0 0 15px 0',
            color: '#0f172a',
            fontSize: '18px',
            fontWeight: '600',
            paddingBottom: '8px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            Personal Information
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                First Name
              </label>
              <div style={{
                padding: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                color: '#0f172a',
                fontSize: '14px'
              }}>
                {formData.firstName}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Last Name
              </label>
              <div style={{
                padding: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                color: '#0f172a',
                fontSize: '14px'
              }}>
                {formData.lastName}
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Email Address
              </label>
              <div style={{
                padding: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                color: '#0f172a',
                fontSize: '14px'
              }}>
                {formData.email}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Phone Number
              </label>
              <div style={{
                padding: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                color: '#0f172a',
                fontSize: '14px'
              }}>
                {formData.phone}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#64748b',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Street Address
            </label>
            <div style={{
              padding: '10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              color: '#0f172a',
              fontSize: '14px'
            }}>
              {formData.address}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: '15px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                City
              </label>
              <div style={{
                padding: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                color: '#0f172a',
                fontSize: '14px'
              }}>
                {formData.city}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                State
              </label>
              <div style={{
                padding: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                color: '#0f172a',
                fontSize: '14px'
              }}>
                {formData.state}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                ZIP Code
              </label>
              <div style={{
                padding: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                color: '#0f172a',
                fontSize: '14px'
              }}>
                {formData.zipCode}
              </div>
            </div>
          </div>
        </div>

        {/* Employment Details */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{
            margin: '0 0 15px 0',
            color: '#0f172a',
            fontSize: '18px',
            fontWeight: '600',
            paddingBottom: '8px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            Employment Details
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Company
              </label>
              <div style={{
                padding: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                color: '#0f172a',
                fontSize: '14px'
              }}>
                {formData.company}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Position
              </label>
              <div style={{
                padding: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                color: '#0f172a',
                fontSize: '14px'
              }}>
                {formData.position}
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '15px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Department
              </label>
              <div style={{
                padding: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                color: '#0f172a',
                fontSize: '14px'
              }}>
                {formData.department}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Start Date
              </label>
              <div style={{
                padding: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                color: '#0f172a',
                fontSize: '14px'
              }}>
                {formData.startDate}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Employment Type
              </label>
              <div style={{
                padding: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                color: '#0f172a',
                fontSize: '14px'
              }}>
                {formData.employmentType}
              </div>
            </div>
          </div>
        </div>

        {/* Acknowledgment */}
        <div style={{
          padding: '15px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{
              width: '18px',
              height: '18px',
              backgroundColor: '#0ea5e9',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}>✓</span>
            </div>
            <p style={{
              margin: '0',
              color: '#0f172a',
              fontSize: '13px',
              lineHeight: '1.5'
            }}>
              I certify that the information provided in this form is true and complete to the best of my knowledge.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: '12px'
        }}>
          <p style={{ margin: '5px 0' }}>
            Form submitted on {new Date().toLocaleDateString()}
          </p>
          <p style={{ margin: '5px 0' }}>
            This document was generated using React to PDF
          </p>
        </div>
      </div>
    </div>
  );
}
