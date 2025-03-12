"use client";
import { getAllPolls } from "@/query";
import { useEffect, useState } from "react";
import PollCard from "../PollCards/PollCard";
import HeaderWithFilter from "../layout/HeaderWithFilter";

const MyPollContent = ({ user }) => {
  const [allPolls, setAllPolls] = useState([]);
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("");
  const fetchAllPolls = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await getAllPolls({ user });
      setAllPolls(response.polls);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // setPage(1);
    fetchAllPolls();
    return () => {};
  }, [filterType]);
  return (
    <div className="my-5 mx-auto">
      <HeaderWithFilter
        title="Poll"
        filterType={filterType}
        setFilterType={setFilterType}
      />
      {allPolls?.map((poll) => (
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
