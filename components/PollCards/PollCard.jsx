import {
  bookmarkPoll,
  closePollById,
  deletePollById,
  voteOnPoll,
} from "@/action/polls";
import { getPollById } from "@/query";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import UserProfileInfo from "../cards/UserProfileInfo";
import PollActions from "./PollActions";
import PollContent from "./PollContent";
import PollingResultContent from "./PollingResultContent";
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
  user,
  isMyPoll,
  createdAt,
}) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [rating, setRating] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [isVoteComplete, setIsVoteComplete] = useState(userHasVoted);
  const [pollResult, setPollResult] = useState({
    options,
    voters,
    responses,
  });

  const isPollBookmarked = user.user.bookmarkedPolls.includes(pollId);

  const [pollBookmarked, setPollBookmarked] = useState(isPollBookmarked);
  const [pollClose, setPollClose] = useState(isPollClosed || false);
  const [pollDeleted, setPollDeleted] = useState(false);
  const handleInput = (value) => {
    if (type === "rating") setRating(value);
    else if (type === "open-ended") setUserResponse(value);
    else setSelectedOptionIndex(value);
  };

  // Generates post data based on the poll type

  const getPostData = useCallback(() => {
    if (type === "open-ended") {
      return { responseText: userResponse, voterId: user.user.id };
    }
    if (type === "rating") {
      return { optionIndex: rating - 1, voterId: user.user.id };
    }
    return { optionIndex: selectedOptionIndex, voterId: user.user.id };
  }, [type, userResponse, rating, selectedOptionIndex, user]);

  // Get Poll Details by ID

  const getPollDetail = async () => {
    try {
      const pollDetails = await getPollById(pollId);
      if (pollDetails) {
        setPollResult({
          options: pollDetails.options || [],
          voters: pollDetails.votersId?.length || 0,
          responses: pollDetails.responses || [],
        });
      }
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error fetching poll details"
      );
    }
  };
  const handleVoteSubmit = async () => {
    try {
      const response = await voteOnPoll(pollId, getPostData());
      getPollDetail();
      setIsVoteComplete(true);
      // onUserVoted();
      toast.success("Vote submitted successfully!");
    } catch (error) {
      console.log(error);
      console.error("Error submitting vote");
    }
  };
  const toggleBookmark = async () => {
    try {
      const result = await bookmarkPoll(pollId, user.user.id);
      setPollBookmarked((prev) => !prev);
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const closePoll = async () => {
    try {
      const result = await closePollById(pollId, user.user.id);
      setPollClose(true);
      toast.success(result.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const deletePoll = async () => {
    try {
      const result = await deletePollById(pollId, user.user.id);
      setPollDeleted(true);
      toast.success(result.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    !pollDeleted &&
    !pollClose && (
      <div className="bg-slate-100/50 my-5 p-5 rounded-lg border border-slate-100 mx-auto">
        <div className="flex items-center justify-between">
          <UserProfileInfo
            imgUrl={creatorProfileImg}
            fullname={creatorName}
            username={creatorUsername}
            createdAt={createdAt}
          />
          <PollActions
            pollId={pollId}
            isVoteComplete={isVoteComplete}
            inputCaptured={
              !!(userResponse || selectedOptionIndex >= 0 || rating)
            }
            onVoteSubmit={handleVoteSubmit}
            isBookmarked={pollBookmarked}
            toggleBookmark={toggleBookmark}
            isMyPoll={isMyPoll}
            pollClosed={pollClose}
            onClosePoll={closePoll}
            onDelete={deletePoll}
          />
        </div>
        <div className="ml-14 mt-3">
          <p className="text-[15px] text-black leading-8">{question}</p>
          <div className="mt-4">
            {isVoteComplete || isPollClosed ? (
              <PollingResultContent
                type={type}
                options={pollResult.options || []}
                voter={pollResult.voters}
                response={pollResult.responses || []}
              />
            ) : (
              <PollContent
                type={type}
                options={options}
                selectedOptionIndex={selectedOptionIndex}
                onOptionSelect={handleInput}
                rating={rating}
                onRatingChange={handleInput}
                userResponse={userResponse}
                onResponseChange={handleInput}
              />
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default PollCard;
