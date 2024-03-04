
import Image from "next/image";
import Heading from "./_components/Heading";
import Hero from "./_components/Hero.tsx/Hero";
import Footer from "./_components/Footer";

const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 ">
        <Heading />
        <Hero />
        <Footer />
      </div>
    </div>
  );
};

export default MarketingPage;
