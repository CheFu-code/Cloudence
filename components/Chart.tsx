import { convertFileSize } from "@/lib/utils";

const CAPACITY = 2 * 1024 * 1024 * 1024;

export const Chart = ({ used = 0 }: { used: number }) => {
  const safeUsed = Number.isFinite(used) ? Math.max(0, used) : 0;
  const percentage = Math.min(100, Number(((safeUsed / CAPACITY) * 100).toFixed(2)));

  return (
    <section className="chart" aria-label="Storage usage">
      <svg
        viewBox="0 0 240 240" width={176} height={176}
        className="chart-container shrink-0" role="img"
        aria-label={`${percentage}% of 2 GB storage used`}
      >
        <circle cx={120} cy={120} r={86} fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={20} />
        {percentage > 0 && (
          <circle
            cx={120} cy={120} r={86} fill="none" stroke="currentColor" strokeWidth={20}
            pathLength={100} strokeDasharray={`${percentage} 100`} strokeLinecap="round"
            transform="rotate(-90 120 120)"
          />
        )}
        <text x={120} y={120} textAnchor="middle" dominantBaseline="middle" className="chart-total-percentage">
          {percentage}%
        </text>
        <text x={120} y={148} textAnchor="middle" className="fill-white/70" fontSize={16}>
          Space used
        </text>
      </svg>
      <div className="chart-details">
        <h2 className="chart-title">Available Storage</h2>
        <p className="chart-description">{convertFileSize(safeUsed)} / 2 GB used</p>
      </div>
    </section>
  );
};
