import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Rating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
}: RatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          disabled={readonly}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
        >
          <Star
            className={sizeClasses[size]}
            fill={value <= rating ? "#fbbf24" : "none"}
            stroke={value <= rating ? "#fbbf24" : "#d1d5db"}
            strokeWidth={2}
          />
        </button>
      ))}
    </div>
  );
}



