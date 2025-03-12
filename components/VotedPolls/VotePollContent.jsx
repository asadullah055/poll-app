import PollCard from "../PollCards/PollCard";

const VotePollContent = ({ polls, user }) => {
  return (
    <>
      {polls.map((poll) => (
        <PollCard
          key={`dashboard_${poll.id}`}
          pollId={poll.id}
          user={user}
          question={poll.question}
          type={poll.type}
          options={poll.options}
          voters={poll.votersId.length || 0}
          responses={poll.responses || []}
          creatorProfileImg={poll.creator.profileImage || null}
          creatorName={poll.creator.fullname}
          creatorUsername={poll.creator.username}
          userHasVoted={poll.userHasVoted || false}
          isPollClosed={poll.closed || false}
          createdAt={poll.createdAt || false}
        />
      ))}
    </>
  );
};

export default VotePollContent;
