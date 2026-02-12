import ScoreGaoge from "./ScoreGaoge";

const Summary = ({ feedback }: { feedback: any }) => {
  const overallScore = feedback?.score ?? 0;

  const scoreColor =
    overallScore > 70
      ? "text-emerald-500"
      : overallScore > 49
      ? "text-amber-500"
      : "text-red-500";

  const bgColor =
    overallScore > 70
      ? "bg-emerald-50"
      : overallScore > 49
      ? "bg-amber-50"
      : "bg-red-50";

  return (
    <div className="w-full rounded-3xl bg-white shadow-xl border border-gray-100 p-8 transition-all duration-300 hover:shadow-2xl">
      
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* Gauge */}
        <div className="flex justify-center items-center">
          <ScoreGaoge score={overallScore} />
        </div>

        {/* Score Details */}
        <div className="flex flex-col gap-4 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-900">
            Resume Score
          </h2>

          <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${bgColor}`}>
            <span className={`${scoreColor}`}>
              {overallScore}%
            </span>
          </div>

          <p className="text-gray-500 max-w-md">
            This score is generated directly from AI-powered resume analysis
            based on job description alignment and ATS optimization.
          </p>

          {feedback?.summary && (
            <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-gray-700 leading-relaxed">
                {feedback.summary}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
