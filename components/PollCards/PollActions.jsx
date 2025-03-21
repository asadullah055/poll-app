"use client";
import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const PollActions = ({
  isVoteComplete,
  inputCaptured,
  onVoteSubmit,
  isBookmarked,
  toggleBookmark,
  isMyPoll,
  pollClosed,
  onClosePoll,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);
  const handleVoteClick = async () => {
    setLoading(true);
    try {
      await onVoteSubmit();
    } catch (error) {
      console.error("Error submitting vote:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-4">
      {(isVoteComplete || pollClosed) && (
        <div className="text-[11px] font-medium text-slate-600 bg-sky-700/10 px-3 py-1 rounded-md">
          {pollClosed ? "Closed" : "Voted"}
        </div>
      )}
      {isMyPoll && !pollClosed && (
        <button
          className="btn-small text-orange-500 bg-orange-500/20 hover:bg-orange-500 hover:text-white hover:border-orange-100"
          onClick={onClosePoll}
          disabled={loading}
        >
          Close
        </button>
      )}
      {isMyPoll && (
        <button
          className="btn-small text-[#AF040E] bg-[#FFFAFA] hover:bg-red-500 hover:text-white hover:border-orange-100"
          onClick={onDelete}
          disabled={loading}
        >
          Delete
        </button>
      )}

      <button title="Bookmark" className="icon-btn" onClick={toggleBookmark}>
        {isBookmarked ? (
          <FaBookmark className="text-primary" />
        ) : (
          <FaRegBookmark />
        )}
      </button>
      {inputCaptured && !isVoteComplete && (
        <button
          className="btn-small ml-auto"
          onClick={handleVoteClick}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      )}
    </div>
  );
};

export default PollActions;
