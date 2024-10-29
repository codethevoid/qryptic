import { LoaderCircle } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex h-[220px] w-full items-center justify-center">
      <LoaderCircle size={20} className="animate-spin opacity-40" />
    </div>
  );
};
