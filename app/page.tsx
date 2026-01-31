import Navbar from '@/components/Navbar';
import ProductSequence from '@/components/ProductSequence';
import SpecsGrid from '@/components/SpecsGrid';
import Footer from '@/components/Footer';
import TechSpecs from '@/components/TechSpecs';
import SoundTest from '@/components/SoundTest';
import ModelSelector from '@/components/ModelSelector';

export default function Home() {
  return (
    <>
      <Navbar />
      <ProductSequence />
      <ModelSelector />
      <div className="relative z-10 bg-spectre-black shadow-[0_-50px_100px_rgba(5,5,5,1)]">
        <TechSpecs />
        <SoundTest />
        <SpecsGrid />
        <Footer />
      </div>
    </>
  );
}
