import { ReactNode } from "react";

const LabLayout = ({ children }: { children: ReactNode }) => {
  return <div className="space-y-20 py-20 max-sm:py-16">{children}</div>;
};

export default LabLayout;
