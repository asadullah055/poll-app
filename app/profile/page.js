import DashboardLayout from "@/components/layout/DashboardLayout";
import ChangePassword from "@/components/profile/ChangePassword";
import ProfileDetails from "@/components/profile/ProfileDetails";
import { getUser } from "@/lib/dal";
import { getAllPolls } from "@/query";

const ProfilePage = async () => {
  const user = await getUser();
  const { stats } = await getAllPolls({});
  return (
    <DashboardLayout user={user} stats={stats}>
      <h2 className="text-xl font-medium text-black mt-2">My Profile</h2>
      <div className="flex flex-wrap md:flex-nowrap gap-5 p-2">
        <div className="w-full bg-slate-50 rounded border-gray-200 border p-2 shadow-rounded">
          <ProfileDetails user={user} />
        </div>
        <div className="w-full">
          <ChangePassword user={user} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
