import Navbar from '@/components/Navbar';
import ProductSequence from '@/components/ProductSequence';
import SpecsGrid from '@/components/SpecsGrid';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <ProductSequence />
      <div className="relative z-10 bg-spectre-black shadow-[0_-50px_100px_rgba(5,5,5,1)]">
        <SpecsGrid />
        <Footer />
      </div>
    </>
  );
}
