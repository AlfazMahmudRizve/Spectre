'use client';
import Navbar from '@/components/Navbar';
import ProductSequence from '@/components/ProductSequence';
import Footer from '@/components/Footer';
import TechSpecs from '@/components/TechSpecs';
import SoundTest from '@/components/SoundTest';
import StaticGrid from '@/components/StaticGrid';
import ModelSelector from '@/components/ModelSelector';
import CartSidebar from '@/components/CartSidebar';
import { useProductStore } from '@/store/productStore';

export default function Home() {
  const { activeProduct, view } = useProductStore();

  return (
    <>
      <Navbar />

      {view === 'product' ? (
        <>
          <ProductSequence key={activeProduct.id} product={activeProduct} />
          <div className="fixed bottom-8 left-0 w-full z-40 pointer-events-none flex justify-center">
            <div className="pointer-events-auto">
              <ModelSelector />
            </div>
          </div>
          <div className="relative z-10 bg-spectre-black shadow-[0_-50px_100px_rgba(5,5,5,1)]">
            <TechSpecs />
            <SoundTest />
          </div>
        </>
      ) : (
        <div className="pt-24 min-h-screen bg-black">
          <StaticGrid />
        </div>
      )}

      <div className="relative z-20 bg-black">
        <Footer />
      </div>

      <CartSidebar />
    </>
  );
}
