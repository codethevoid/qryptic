import { Hero } from "./components/hero";
import { Trust } from "./components/trust";
import { Products } from "./components/products";

const LandingPage = () => {
  return (
    <div className="space-y-20 py-20 max-sm:py-16">
      <Hero />
      <Products />
    </div>
  );
};

export default LandingPage;
