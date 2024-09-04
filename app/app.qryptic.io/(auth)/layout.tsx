import { ReactNode } from "react";
import { Grid } from "@/components/layout/grid";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Readonly<AuthLayoutProps>) => {
  return (
    <div>
      <Grid />
      {children}
    </div>
  );
};

export default AuthLayout;
