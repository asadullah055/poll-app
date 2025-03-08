import PollContent from "./PollContent";

const PollCard = ({
  pollId,
  question,
  type,
  options,
  voters,
  responses,
  creatorProfileImg,
  creatorName,
  creatorUsername,
  userHasVoted,
  isPollClosed,
  createdAt,
}) => {
  return (
    <div className="ml-14 mt-3">
      <p className="text-[15px] text-black leading-8">{question}</p>
      <PollContent
        type={type}
        options={options}
        // selectedOptionIndex={selectedOptionIndex}
        // onOptionSelect={handleInput}
        // rating={rating}
        /* onRatingChange={handleInput}
                userResponse={userResponse}
                onResponseChange={handleInput} */
      />
    </div>
  );
};

export default PollCard;
