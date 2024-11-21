import { GodRays } from "@/components/layout/god-rays";

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {process.env.NODE_ENV === "production" && <GodRays />}
      {children}
    </>
  );
};

export default OnboardingLayout;
