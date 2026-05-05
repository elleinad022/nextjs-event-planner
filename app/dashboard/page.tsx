import DashboardContent from "@/components/dashboard-content";
import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await getSession();
  if (!session.data?.user.id) {
    redirect("/login");
  }

  return <DashboardContent userId={session.data?.user.id} />;
};

export default DashboardPage;
