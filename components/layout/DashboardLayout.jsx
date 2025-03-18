import UserDetailsCard from "../cards/UserDetailsCard";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import TreadingPolls from "./TreadingPolls";

const DashboardLayout = async ({ children, user, stats }) => {
  return (
    <div>
      <Navbar user={user} />
      {user && (
        <div className="flex justify-between">
          <div className="hidden md:block">
            <SideMenu />
          </div>
          <div className="grow mx-5">{children}</div>
          <div className="hidden lg:block mr-5 min-w-[300px]">
            <UserDetailsCard
              profileImageUrl={user.user?.profileImage}
              fullName={user.user?.fullname}
              username={user.user?.username}
              totalBookmarkedPolls={user?.totalBookmarkedPolls || 0}
              totalPollsCreated={user?.totalPollsCreated || 0}
              totalPollsVote={user?.totalPollsVote || 0}
            />
            {stats?.length > 0 && <TreadingPolls stats={stats} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
