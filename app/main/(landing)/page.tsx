import { Hero } from "./components/hero";
import { Highlights } from "./components/highlights";
import { Products } from "./components/products";
import { GetStarted } from "./components/get-started";
import { StartNow } from "../pricing/components/start-now";
import { Faq } from "./components/faq";

const LandingPage = () => {
  return (
    <>
      <div className="space-y-20 py-20 max-sm:py-16">
        <Hero />
        <Highlights />
        <Products />
        <Faq />
        <GetStarted />
      </div>
    </>
  );
};

export default LandingPage;
