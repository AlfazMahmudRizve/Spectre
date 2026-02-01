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

    return (
        <DashboardClient
            initialOrders={dbData.orders}
            initialUsers={dbData.users}
            initialProducts={dbData.products}
            // @ts-ignore
            userRole={session.user.role || 'viewer'}
            userName={session.user.name || 'Operative'}
        />
    );
}
