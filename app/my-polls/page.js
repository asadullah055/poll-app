import DashboardLayout from "@/components/layout/DashboardLayout";
import MyPollContent from "@/components/myPolls/MyPollContent";
import { getUser } from "@/lib/dal";
import { getAllPolls } from "@/query";

export default async function MyPolls() {
  const user = await getUser();
  const { stats, polls } = await getAllPolls({ user });

  return (
    <DashboardLayout user={user} stats={stats}>
      <MyPollContent user={user} initialPolls={polls} />
    </DashboardLayout>
  );
}
