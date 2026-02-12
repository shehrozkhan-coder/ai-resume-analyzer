import { useState } from "react";

interface Feedback {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

const Section = ({
  title,
  items,
  type,
}: {
  title: string;
  items: string[];
  type: "good" | "improve";
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
      
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <div className="text-gray-400 text-sm">
          {open ? "−" : "+"}
        </div>
      </div>

      {open && (
        <div className="mt-6 space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl text-sm font-medium flex gap-3 transition-all duration-200 hover:scale-[1.01] ${
                type === "good"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-amber-50 text-amber-700 border border-amber-100"
              }`}
            >
              <div className="text-lg">
                {type === "good" ? "✅" : "⚡"}
              </div>
              <p>{item}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  const safeScore = Math.max(0, Math.min(feedback?.score ?? 0, 100));

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold">Overall ATS Score</h2>
        <div className="text-5xl font-extrabold mt-4">
          {safeScore}%
        </div>
        <p className="mt-4 text-sm opacity-90 leading-relaxed">
          {feedback.summary}
        </p>
      </div>

      {/* Strengths */}
      <Section
        title="💪 Strengths"
        items={feedback.strengths || []}
        type="good"
      />

      {/* Weaknesses */}
      <Section
        title="⚠ Weaknesses"
        items={feedback.weaknesses || []}
        type="improve"
      />

      {/* Improvements */}
      <Section
        title="🚀 Improvements"
        items={feedback.improvements || []}
        type="improve"
      />

    </div>
  );
};

export default Details;
