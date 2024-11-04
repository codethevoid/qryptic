import { GeistSans } from "geist/font/sans";
import { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: Readonly<AppLayoutProps>) => {
  return <div className={GeistSans.className}>{children}</div>;
};

export default AppLayout;
