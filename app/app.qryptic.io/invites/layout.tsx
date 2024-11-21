import { ReactNode } from "react";
import { GodRays } from "@/components/layout/god-rays";

const InviteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <GodRays />
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-10">
        {children}
      </div>
    </>
  );
};

export default InviteLayout;
