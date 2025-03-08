"use client";

import { useState } from "react";
import HeaderWithFilter from "../layout/HeaderWithFilter";
import PollCard from "../PollCards/PollCard";

const HomeContent = ({ polls }) => {
  const [filterType, setFilterType] = useState("");
  return (
    <div className="my-5 mx-auto">
      <HeaderWithFilter
        title="Poll"
        filterType={filterType}
        setFilterType={setFilterType}
      />
      {polls.map((poll) => (
        <PollCard
          key={poll.id}
          pollId={poll.id}
          question={poll.question}
          type={poll.type}
          options={poll.options}
          voters={poll.votersId.length || 0}
          responses={poll.responses || []}
          creatorProfileImg={poll.creator.profileImage || null}
          creatorName={poll.creator.fullName}
          creatorUsername={poll.creator.username}
          userHasVoted={poll.userHasVoted || false}
          isPollClosed={poll.closed || false}
          createdAt={poll.createdAt || false}
        />
      ))}
    </div>
  );
};

export default HomeContent;
