import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score }: { score: number }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  const safeScore = Math.max(0, Math.min(100, score));
  const percentage = safeScore / 100;

  // Dynamic color based on score
  const gradientId = `gaugeGradient-${safeScore}`;

  const startColor =
    safeScore > 70
      ? "#10b981" // green
      : safeScore > 49
      ? "#f59e0b" // amber
      : "#ef4444"; // red

  const endColor =
    safeScore > 70
      ? "#34d399"
      : safeScore > 49
      ? "#fbbf24"
      : "#f87171";

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-24">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <defs>
            <linearGradient
              id={gradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Animated Foreground Arc */}
          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - percentage)}
            style={{
              transition: "stroke-dashoffset 1s ease-in-out",
            }}
          />
        </svg>

        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          <span className="text-3xl font-bold text-gray-900">
            {safeScore}
          </span>
          <span className="text-sm text-gray-500">out of 100</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
