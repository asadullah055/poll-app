import UserDetailsCard from "../cards/UserDetailsCard";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import TreadingPolls from "./TreadingPolls";

const DashboardLayout = async ({ children, user, stats }) => {
  return (
    <div>
      <Navbar />
      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu />
          </div>
          <div className="grow mx-5">{children}</div>
          <div className="hidden md:block mr-5">
            <UserDetailsCard
              profileImageUrl={user.user?.profileImage}
              fullName={user.user?.fullname}
              username={user.user?.username}
              totalBookmarkedPolls={user?.totalBookmarkedPolls || 0}
              totalPollsCreated={user?.totalPollsCreated?.createById || 0}
              totalPollsVote={user?.totalPollsVote?.votersId || 0}
            />
            {stats?.length > 0 && <TreadingPolls stats={stats} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
