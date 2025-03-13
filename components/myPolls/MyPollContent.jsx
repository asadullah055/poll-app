"use client";

import { fetchFilteredPolls } from "@/query";
import { useState, useTransition } from "react";
import { LuPenTool } from "react-icons/lu";
import PollCard from "../PollCards/PollCard";
import EmptyCard from "../cards/EmptyCard";
import HeaderWithFilter from "../layout/HeaderWithFilter";

const MyPollContent = ({ user, initialPolls }) => {
  const [polls, setPolls] = useState(initialPolls);
  const [filterType, setFilterType] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (newFilter) => {
    setFilterType(newFilter);
    startTransition(async () => {
      const filteredData = await fetchFilteredPolls(user, newFilter);
      setPolls(filteredData.polls);
    });
  };
  return (
    <div className="my-5 mx-auto">
      <HeaderWithFilter
        title="My Polls"
        filterType={filterType}
        setFilterType={handleFilterChange}
      />
      {polls.length === 0 && (
        <EmptyCard
          icon={<LuPenTool size={100} />}
          message="Welcome you are the first user of the system and there are no polls yet. Start by creating the first poll"
          linkText="Create Poll"
          goTo={"/create-poll"}
        />
      )}
      {polls?.map((poll) => (
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
      ))}
    </div>
  );
};

export default MyPollContent;
