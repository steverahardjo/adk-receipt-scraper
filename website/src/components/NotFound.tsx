export default function NotFoundComponent({ cause }: { cause?: 'notFound' }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="display-title mb-4 text-6xl font-bold text-[var(--sea-ink)]">
          404
        </h1>
        <p className="mb-6 text-lg text-[var(--sea-ink-soft)]">
          {cause === 'notFound'
            ? 'The page you were looking for does not exist.'
            : 'Page not found.'}
        </p>
        <a
          href="/"
          className="inline-flex items-center rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
        >
          Go Back Home
        </a>
      </div>
    </div>
  )
}
