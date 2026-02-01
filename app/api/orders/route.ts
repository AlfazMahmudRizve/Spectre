import { NextResponse } from 'next/server';
import { createOrder, createUser, getUserByEmail } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, total, shippingDetails, email } = body;

        // Try to identify user
        const session = await getServerSession(authOptions);
        // @ts-ignore
        let userId = session?.user?.id;

        // If no session, check if email exists in DB or create Shadow User
        if (!userId) {
            const existingUser = await getUserByEmail(email);
            if (existingUser) {
                userId = existingUser.id;
            } else {
                // Auto-create Shadow User (Guest)
                const newUser = await createUser({
                    email,
                    name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
                    role: 'customer',
                    provider: 'credentials' // Treated as "guest" account
                });
                userId = newUser.id;
            }
        }

        const order = await createOrder({
            userId: userId!,
            email,
            items,
            total,
            shippingDetails,
        });

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error('Order Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to process order' }, { status: 500 });
    }
}
