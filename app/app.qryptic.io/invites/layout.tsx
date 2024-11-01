import { ReactNode } from "react";
import { Grid } from "@/components/layout/grid";

const InviteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Grid />
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-10">
        {children}
      </div>
    </>
  );
};

export default InviteLayout;
