import PollForm from "@/components/createPoll/PollForm";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getUser } from "@/lib/dal";

const CreatePollPage = async () => {
  const user  = await getUser();

  return (
    <DashboardLayout user={user}>
      <PollForm />
    </DashboardLayout>
  );
};

export default CreatePollPage;
