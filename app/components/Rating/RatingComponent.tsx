interface RatingComponentProps {
  score: number;
}

const RatingComponent: React.FC<RatingComponentProps> = ({ score }) => {
  const stars = Math.round(score); // Keep the score as it is (out of 10)

  return (
    <div className="rating rating-half flex items-center pointer-events-none">
      {Array.from({ length: 10 }, (_, index) => {
        const isFilled = index + 1 === stars; // Check if this star should be filled
        const halfStarClass = index % 2 === 0 ? "mask-half-1" : "mask-half-2"; // Alternate between half-1 and half-2

        return (
          <input
            key={index}
            type="radio"
            className={`mask mask-star-2 bg-orange-400 ${halfStarClass}`}
            defaultChecked={isFilled}
            disabled // Disable inputs for display-only rating
          />
        );
      })}
      <span className="ml-2 text-sm">{stars}/10</span>
    </div>
  );
};

export default RatingComponent;

