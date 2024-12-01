import { Hero } from "./components/hero";
import { Highlights } from "./components/highlights";
import { Products } from "./components/products";
import { GetStarted } from "./components/get-started";
import { Faq } from "./components/faq";
import { FinalCta } from "./components/final-cta";

const LandingPage = async () => {
  return (
    <>
      <div className="space-y-20 py-20 max-sm:py-16">
        <Hero />
        <Highlights />
        <Products />
        <Faq />
        {/* <GetStarted /> */}
        <FinalCta />
      </div>
    </>
  );
};

export default LandingPage;
