import { GeistSans } from "geist/font/sans";
import { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: Readonly<AppLayoutProps>) => {
  return <div className={GeistSans.className}>{children}</div>;
};

export default AppLayout;
