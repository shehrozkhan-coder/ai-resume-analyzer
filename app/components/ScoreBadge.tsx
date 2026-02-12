const ScoreBadge = ({ score }: { score: number }) => {
  const bgColor =
    score > 70
      ? "bg-green-100 text-green-600"
      : score > 49
      ? "bg-yellow-100 text-yellow-600"
      : "bg-red-100 text-red-600";

  return (
    <div
      className={`px-4 py-2 rounded-full text-sm font-semibold ${bgColor}`}
    >
      {score} / 100
    </div>
  );
};

export default ScoreBadge;
