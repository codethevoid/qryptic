import { ReactNode } from "react";
import { Grid } from "@/components/layout/grid";
import { GeistSans } from "geist/font/sans";

const RootDomainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={GeistSans.className}>
      <Grid />
      {children}
    </div>
  );
};

export default RootDomainLayout;
