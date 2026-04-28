'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Algo deu errado</h1>
        <p style={{ marginTop: '0.5rem', color: '#555' }}>
          {error.digest ? `Código: ${error.digest}` : 'Erro inesperado.'}
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            border: '2px solid #000',
            background: '#ccff00',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  )
}
