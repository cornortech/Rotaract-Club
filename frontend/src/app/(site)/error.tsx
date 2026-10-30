"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="container-x flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="h-display text-3xl">Something went wrong</h1>
      <p className="mt-3 text-muted">Please try again in a moment.</p>
      <button type="button" onClick={reset} className="btn-primary mt-6">Try again</button>
    </section>
  );
}
