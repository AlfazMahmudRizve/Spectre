import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import DashboardClient from "./DashboardClient"
import { getDashboardData } from "@/lib/db"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // Strict Admin Check
    // @ts-ignore
    if (!session || session.user?.role !== 'admin') {
        redirect('/');
    }

    // Fetch Real Data
    const dbData = await getDashboardData();

    return <DashboardClient initialData={dbData} user={session.user} />;
}
