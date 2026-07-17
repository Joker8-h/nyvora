'use client';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white', padding: 24 }}>
      <div style={{ maxWidth: 600, width: '100%' }}>
        <h1 style={{ fontSize: 20, fontWeight: 'bold', color: '#ef4444', marginBottom: 16 }}>Application Error</h1>
        <div style={{ padding: 16, background: '#1a1a1a', borderRadius: 8, marginBottom: 16, border: '1px solid #333' }}>
          <p style={{ fontSize: 14, color: '#ccc', marginBottom: 8 }}><strong>Message:</strong> {error.message}</p>
          {error.digest && <p style={{ fontSize: 14, color: '#ccc', marginBottom: 8 }}><strong>Digest:</strong> {error.digest}</p>}
          {error.stack && (
            <pre style={{ fontSize: 11, color: '#888', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 300, overflow: 'auto' }}>
              {error.stack}
            </pre>
          )}
        </div>
        <button onClick={reset} style={{ padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>
          Reintentar
        </button>
      </div>
    </div>
  );
}
