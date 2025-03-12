import DashboardLayout from "@/components/layout/DashboardLayout";
import VotePollContent from "@/components/VotedPolls/VotePollContent";
import { getUser } from "@/lib/dal";
import { getVotedPolls } from "@/query";

const VotedPolls = async () => {
  const user = await getUser();

  
  const { polls } = await getVotedPolls({ user });

  return (
    <DashboardLayout user={user}>
      <div className="my-5 mx-auto">
        <h2 className="text-xl font-medium text-black">Voted Polls</h2>
        <VotePollContent polls={polls} user={user} />
      </div>
    </DashboardLayout>
  );
};

export default VotedPolls;
