import HomeContent from "@/components/home/Home";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getUser } from "@/lib/dal";
import { getAllPolls } from "@/query";

export default async function Home() {
  const user = await getUser();
  const { stats, polls } = await getAllPolls({});


  return (
    <DashboardLayout user={user} stats={stats}>
      <HomeContent initialPolls={polls} user={user} />
    </DashboardLayout>
  );
}