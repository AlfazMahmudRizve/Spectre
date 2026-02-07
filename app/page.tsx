import { prisma } from '@/lib/prisma';
import SpectreClient from '@/components/SpectreClient';
import { Product } from '@/types/product';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Fetch data directly from DB (Server Component)
  const productsResult = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' }
  });

  // Cast JSON fields to compatible types for frontend
  const products = productsResult.map((p: any) => ({
    ...p,
    specs: p.specs as unknown as any[],
    phases: p.phases as unknown as any[],
    visuals: p.visuals as unknown as any
  })) as Product[];

  return (
    <main className="min-h-screen bg-black">
      <SpectreClient initialProducts={products} />
    </main>
  );
}
