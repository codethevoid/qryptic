import { ReactNode } from "react";
import { MainNav } from "@/components/layout/navigation/main-nav";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <MainNav />
      {children}
    </div>
  );
};

export default MainLayout;
