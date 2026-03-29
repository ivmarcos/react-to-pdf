import { useEffect, useState } from 'react';

export default function TicketExample() {
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
      console.error('[TicketExample] Failed to load react-to-pdf:', error);
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

  return <TicketContent usePDF={usePDF} />;
}

function TicketContent({ usePDF }: { usePDF: any }) {
  const { targetRef, toPDF } = usePDF({
    filename: 'event-ticket.pdf',
    page: {
      format: [400, 200],
      margin: 0
    }
  });

  const ticketData = {
    eventName: 'React Conference 2024',
    attendeeName: 'John Smith',
    eventDate: 'March 15, 2024',
    eventTime: '9:00 AM - 5:00 PM',
    venue: 'Tech Convention Center',
    venueAddress: '123 Innovation Ave, San Francisco, CA',
    ticketType: 'VIP Pass',
    ticketNumber: 'RC2024-VIP-001',
    seatNumber: 'A-12',
    price: '$299.00'
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
          📥 Download Ticket PDF
        </button>
      </div>

      <div ref={targetRef} style={{
        backgroundColor: 'white',
        padding: '0',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', position: 'relative' }}>
          {/* Main ticket body */}
          <div style={{
            flex: '1',
            padding: '30px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative'
          }}>
            {/* Event name */}
            <h1 style={{
              margin: '0 0 20px 0',
              fontSize: '28px',
              fontWeight: '700',
              color: 'white'
            }}>
              {ticketData.eventName}
            </h1>

            {/* Attendee */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Attendee
              </p>
              <p style={{ margin: '0', fontSize: '20px', fontWeight: '600' }}>
                {ticketData.attendeeName}
              </p>
            </div>

            {/* Date and time */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Date & Time
              </p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>
                {ticketData.eventDate}
              </p>
              <p style={{ margin: '0', fontSize: '14px', opacity: 0.9 }}>
                {ticketData.eventTime}
              </p>
            </div>

            {/* Venue */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Venue
              </p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>
                {ticketData.venue}
              </p>
              <p style={{ margin: '0', fontSize: '13px', opacity: 0.9 }}>
                {ticketData.venueAddress}
              </p>
            </div>

            {/* Ticket details */}
            <div style={{
              display: 'flex',
              gap: '30px',
              marginTop: '30px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div>
                <p style={{ margin: '0 0 5px 0', fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Seat
                </p>
                <p style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                  {ticketData.seatNumber}
                </p>
              </div>
              <div>
                <p style={{ margin: '0 0 5px 0', fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Type
                </p>
                <p style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                  {ticketData.ticketType}
                </p>
              </div>
            </div>
          </div>

          {/* Stub section */}
          <div style={{
            width: '180px',
            padding: '30px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderLeft: '2px dashed rgba(255, 255, 255, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div>
              <p style={{ margin: '0 0 10px 0', fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Ticket No.
              </p>
              <p style={{
                margin: '0 0 20px 0',
                fontSize: '13px',
                fontWeight: '600',
                wordBreak: 'break-all'
              }}>
                {ticketData.ticketNumber}
              </p>
            </div>

            {/* QR Code placeholder */}
            <div style={{
              width: '100px',
              height: '100px',
              backgroundColor: 'white',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '20px 0'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%, #e5e7eb), linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%, #e5e7eb)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px'
              }} />
            </div>

            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Price
              </p>
              <p style={{ margin: '0', fontSize: '20px', fontWeight: '700' }}>
                {ticketData.price}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
