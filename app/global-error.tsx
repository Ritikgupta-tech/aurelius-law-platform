'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#07182E', color: '#F8F5EF', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '1px solid #C6A36B', transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <span style={{ transform: 'rotate(-45deg)', color: '#C6A36B', fontSize: '20px', fontWeight: 'bold' }}>§</span>
          </div>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '11px', color: '#C6A36B', fontWeight: 600, margin: '0 0 12px 0' }}>
            Critical System Exception
          </p>
          <h1 style={{ fontSize: '32px', fontWeight: 400, margin: '0 0 16px 0', fontFamily: 'serif' }}>
            Aurelius & Co. System Boundary
          </h1>
          <p style={{ maxWidth: '480px', fontSize: '13px', lineHeight: '1.6', color: '#CBD5E1', margin: '0 0 24px 0' }}>
            A critical system exception was intercepted at the application root. Please re-attempt the session or reconnect to the primary legal portal.
          </p>
          {error.digest && (
            <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94A3B8', marginBottom: '24px' }}>
              Fault Signature: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              padding: '12px 28px',
              backgroundColor: '#C6A36B',
              color: '#07182E',
              border: 'none',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              cursor: 'pointer',
            }}
          >
            Restart Session
          </button>
        </div>
      </body>
    </html>
  );
}
