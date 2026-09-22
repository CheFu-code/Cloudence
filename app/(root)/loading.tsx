export default function Loading() {
  return (
    <div className="page-container" aria-busy="true">
      <section className="w-full">
        <div className="h-10 w-40 animate-pulse rounded bg-light-400/20" />
        <div className="mt-6 h-6 w-52 animate-pulse rounded bg-light-400/20" />
      </section>

      <section className="file-list">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-48 animate-pulse rounded-xl bg-light-400/10"
          />
        ))}
      </section>
    </div>
  );
}
