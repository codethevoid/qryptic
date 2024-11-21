import { ReactNode } from "react";
import { GodRays } from "@/components/layout/god-rays";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Readonly<AuthLayoutProps>) => {
  return (
    <div>
      <GodRays />
      {children}
    </div>
  );
};

export default AuthLayout;
