import DashboardLayout from "@/components/layout/DashboardLayout";
import { getUser } from "@/lib/dal";

export default async function Home() {
  const user = await getUser()

  return (
    <DashboardLayout >

    </DashboardLayout>
  );
}
