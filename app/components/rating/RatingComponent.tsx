import { Star } from "lucide-react";

interface RatingComponentProps {
  score: number;
}

const RatingComponent: React.FC<RatingComponentProps> = ({ score }) => {
  const normalizedScore = Math.max(0, Math.min(10, Math.round(score || 0)));
  const filledStars = normalizedScore / 2;

  return (
    <div
      className="pointer-events-none flex items-center gap-1"
      aria-label={`Rating ${normalizedScore} out of 10`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => {
          const fillRatio = Math.max(0, Math.min(1, filledStars - index));
          return (
            <span key={index} className="relative inline-flex h-4 w-4">
              <Star className="h-4 w-4 text-gray-500/50" fill="currentColor" />
              {fillRatio > 0 && (
                <span
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${fillRatio * 100}%` }}
                >
                  <Star className="h-4 w-4 text-orange-400" fill="currentColor" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      <span className="ml-1 text-sm">{normalizedScore}/10</span>
    </div>
  );
};

export default RatingComponent;

