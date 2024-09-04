import { ReactNode } from "react";
import { MainNav } from "@/components/layout/navigation/main-nav";
import { Grid } from "@/components/layout/grid";
import { Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/layout/navigation/footer";

const grotesk = Space_Grotesk({ subsets: ["latin"] });

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={grotesk.className}>
      <Grid />
      <MainNav />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
