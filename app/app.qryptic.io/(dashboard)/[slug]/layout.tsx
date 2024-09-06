import { ReactNode } from "react";
import { TeamAuth } from "./auth";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return <TeamAuth>{children}</TeamAuth>;
};

export default AppLayout;
