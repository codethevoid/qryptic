import { ReactNode } from "react";
import { Grid } from "@/components/layout/grid";
import { GeistSans } from "geist/font/sans";
import { GodRays } from "@/components/layout/god-rays";

const RootDomainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={GeistSans.className}>
      <Grid />
      <GodRays />
      {children}
    </div>
  );
};

export default RootDomainLayout;
