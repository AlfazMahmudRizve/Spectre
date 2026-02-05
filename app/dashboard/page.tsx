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
        // redirect('/');
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono p-8">
                <div className="border border-red-500 p-8 rounded bg-red-900/10">
                    <h1 className="text-2xl text-red-500 mb-4">ACCESS DENIED (DEBUG MODE)</h1>
                    <p className="mb-2">Server Refused Entry.</p>
                    <div className="bg-black p-4 rounded text-xs text-gray-400 whitespace-pre-wrap">
                        {JSON.stringify(session, null, 2)}
                    </div>
                    <p className="mt-4 text-xs text-gray-500">
                        Reason: Role is '{// @ts-ignore 
                            session?.user?.role || 'undefined'}' but required 'admin'.
                    </p>
                </div>
            </div>
        )
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
