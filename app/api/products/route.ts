import { NextResponse } from 'next/server';
import { addProduct, getProducts } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const products = await getProducts();
    return NextResponse.json(products);
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // @ts-ignore
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, price, stock, image, description } = body; // accept description/image for potential future use

        const newProduct = await addProduct({
            name,
            price: parseFloat(price),
            stock: parseInt(stock),
            // We'll store image/desc in the object even if not strictly typed yet in some interfaces
            // @ts-ignore
            image,
            description
        });

        return NextResponse.json({ success: true, product: newProduct });
    } catch (error) {
        console.error("API Error adding product:", error);
        return NextResponse.json({ success: false, error: 'Failed to add product' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        // @ts-ignore
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        const { deleteProduct } = await import('@/lib/db');
        const success = await deleteProduct(id);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
