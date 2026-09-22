export default function Loading() {
  return (
    <div className="page-container min-h-full" aria-busy="true">
      <section className="w-full">
        <div className="h-8 w-36 animate-pulse rounded bg-white/70" />
        <div className="mt-5 h-5 w-48 animate-pulse rounded bg-white/70" />
      </section>

      <section className="file-list">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-xl bg-white/70"
          />
        ))}
      </section>
    </div>
  );
}
