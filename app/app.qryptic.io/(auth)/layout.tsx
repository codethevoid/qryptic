import { ReactNode } from "react";
import { Grid } from "@/components/layout/grid";
import { GodRays } from "@/components/layout/god-rays";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Readonly<AuthLayoutProps>) => {
  return (
    <div>
      <Grid />
      <GodRays />
      {children}
    </div>
  );
};

export default AuthLayout;
