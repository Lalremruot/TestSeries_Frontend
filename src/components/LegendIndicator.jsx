// src/components/LegendIndicator.jsx
const statusMap = {
  attempted: "bg-green-500",
  "not visited": "bg-gray-400",
  unanswered: "bg-red-500",
  "marked for review": "bg-yellow-400",
  "marked & answered": "bg-yellow-400 border-2 border-green-700",
};

const LegendIndicator = () => {
  return (
    <div className="mb-4 text-sm space-y-2">
      {/* <h3 className="font-semibold">Legend:</h3> */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(statusMap).map(([label, color]) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-5 h-5 text-center text-gray-800 ${color} rounded`}>2</div>
            <span className="whitespace-nowrap">{label.charAt(0).toUpperCase() + label.slice(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegendIndicator;
