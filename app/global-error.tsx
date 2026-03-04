"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ padding: "2rem", fontFamily: "system-ui" }}>
        <h1>Application error</h1>
        <pre style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: "1rem", borderRadius: "4px" }}>
          {error.message}
        </pre>
        {error.stack && (
          <details style={{ marginTop: "1rem" }}>
            <summary>Stack</summary>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: "12px" }}>{error.stack}</pre>
          </details>
        )}
        <button
          type="button"
          onClick={reset}
          style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
