import { CiBookmark } from "react-icons/ci";
import EmptyCard from "../cards/EmptyCard";
import PollCard from "../PollCards/PollCard";

const BookmarkPollContent = ({ user, polls }) => {
  console.log(polls.length);

  return (
    <div className="my-5 mx-auto">
      {polls.length === 0 && (
        <EmptyCard
          icon={<CiBookmark size={100} />}
          message="You have't bookmarked any polls yet, Start bookmarking your favourites to keep track of them"
          linkText="Home Page"
          goTo={"/"}
        />
      )}
      {polls?.map((poll) => {
        if (!user.user?.bookmarkedPolls?.includes(poll.id)) return null;
        return (
          <PollCard
            key={poll.id}
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
            isMyPoll={poll.createById === user.user.id}
          />
        );
      })}
    </div>
  );
};

export default BookmarkPollContent;
