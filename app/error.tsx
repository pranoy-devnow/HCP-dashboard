"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <pre className="mt-2 max-w-2xl overflow-auto rounded bg-muted p-4 text-sm">
        {error.message}
      </pre>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground"
      >
        Try again
      </button>
    </div>
  )
}
