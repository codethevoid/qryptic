import { Separator } from "@/components/ui/separator";
import { GodRays } from "@/components/layout/god-rays";

const Custom404 = () => {
  return (
    <>
      <GodRays />
      <div className="grid h-screen w-full place-items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-medium">404</h1>
          <Separator orientation="vertical" className="h-6" />
          <h2 className="text-xs">This page could not be found.</h2>
        </div>
      </div>
    </>
  );
};

export default Custom404;
