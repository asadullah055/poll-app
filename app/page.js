import HomeContent from "@/components/home/Home";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getUser } from "@/lib/dal";
import { getAllPolls } from "@/query";

export default async function Home() {
  const  user  = await getUser();
  const { polls, stats } = await getAllPolls({user});


  return (
    <DashboardLayout user={user} stats={stats}>
      <HomeContent polls={polls} user={user} />
    </DashboardLayout>
  );
}
