import { GodRays } from "@/components/layout/god-rays";

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <GodRays />
      {children}
    </>
  );
};

export default OnboardingLayout;
