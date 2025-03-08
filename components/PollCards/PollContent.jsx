"use client";
import ImageOptionInputTile from "../input/ImageOptionInputTile";
import OptionInputTile from "../input/OptionInputTile";
import Rating from "../input/Rating";

const PollContent = ({
  type,
  options,
  selectedOptionIndex,
  onOptionSelect,
  rating,
  onRatingChange,
  userResponse,
  onResponseChange,
}) => {
  switch (type) {
    case "single-choice":
    case "yes/no":
      return (
        <>
          {options.map((option, index) => (
            <OptionInputTile
              key={index}
              isSelected={selectedOptionIndex === index}
              label={option.optionText || ""}
              onSelect={() => onOptionSelect(index)}
            />
          ))}
        </>
      );
    case "image-based":
      return (
        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <ImageOptionInputTile
              key={index}
              isSelected={selectedOptionIndex === index}
              imgUrl={option.optionText || ""}
              onSelect={() => onOptionSelect(index)}
            />
          ))}
        </div>
      );
    case "rating":
      return <Rating value={rating} onChange={onRatingChange} />;
    case "open-ended":
      return (
        <div className="-mt-3">
          <textarea
            placeholder="Your response"
            className="w-full text-[13px] text-block outline-none bg-slate-200/80 p-2 rounded-md mt-2"
            rows={4}
            value={userResponse}
            onChange={(e) => onResponseChange(e.target.value)}
          ></textarea>
        </div>
      );
    default:
      return null;
  }
};

export default PollContent;
