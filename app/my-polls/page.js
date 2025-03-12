import DashboardLayout from "@/components/layout/DashboardLayout";
import MyPollContent from "@/components/myPolls/MyPollContent";
import { getUser } from "@/lib/dal";
import { getVotedPolls } from "@/query";

export default async function MyPolls() {
  const  user  = await getUser();
  const {stats } = await getVotedPolls({user});


  return (
    <DashboardLayout user={user} stats={stats}>
      <MyPollContent  user={user} />
    </DashboardLayout>
  );
}
