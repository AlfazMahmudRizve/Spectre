import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing Required Fields' }, { status: 400 });
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ error: 'Email Already Registered' }, { status: 409 });
        }

        const newUser = await createUser({
            name,
            email,
            password,
            role: 'customer',
            provider: 'credentials'
        });

        return NextResponse.json({ success: true, user: { email: newUser.email, name: newUser.name } });

    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
