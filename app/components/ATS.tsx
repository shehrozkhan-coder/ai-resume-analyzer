import { useEffect, useState } from "react";

interface ATSSuggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number; // 0–100
  suggestion: ATSSuggestion[];
}

const ATS = ({ score, suggestion }: ATSProps) => {
  const safeScore = Math.max(0, Math.min(score, 100));
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      current += 1;

      if (current >= safeScore) {
        current = safeScore;
        clearInterval(interval);
      }

      setDisplayScore(current);
    }, 8);

    return () => clearInterval(interval);
  }, [safeScore]);

  const scoreColor =
    safeScore > 75
      ? "text-emerald-500"
      : safeScore > 50
      ? "text-amber-500"
      : "text-red-500";

  const progressGradient =
    safeScore > 75
      ? "from-emerald-400 to-emerald-600"
      : safeScore > 50
      ? "from-amber-400 to-amber-600"
      : "from-red-400 to-red-600";

  return (
    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-8 space-y-8 transition-all duration-300 hover:shadow-3xl">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            ATS Compatibility
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            How well your resume performs in Applicant Tracking Systems
          </p>
        </div>

        <div className={`text-5xl font-extrabold ${scoreColor}`}>
          {displayScore}%
        </div>
      </div>

      {/* Animated Gradient Progress Bar */}
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${progressGradient} transition-all duration-1000 ease-out`}
          style={{ width: `${safeScore}%` }}
        />
      </div>

      {/* Suggestions */}
      <div className="grid gap-4">
        {suggestion.length > 0 ? (
          suggestion.map((item, index) => (
            <div
              key={`${item.type}-${index}`}
              className={`p-5 rounded-2xl text-sm font-medium flex items-start gap-4 transition-all duration-200 hover:scale-[1.01] ${
                item.type === "good"
                  ? "bg-emerald-50 border border-emerald-100 text-emerald-700"
                  : "bg-amber-50 border border-amber-100 text-amber-700"
              }`}
            >
              <div className="text-xl">
                {item.type === "good" ? "✅" : "⚡"}
              </div>
              <p className="leading-relaxed">{item.tip}</p>
            </div>
          ))
        ) : (
          <div className="p-4 bg-gray-50 rounded-xl text-gray-500 text-sm">
            No ATS suggestions available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ATS;
