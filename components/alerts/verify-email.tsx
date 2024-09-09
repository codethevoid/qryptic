import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { ArrowRight, Info, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

type VerifyEmailAlertProps = {
  isLoading: boolean;
  isEmailVerified?: boolean;
};

export const VerifyEmailAlert = ({ isEmailVerified, isLoading }: VerifyEmailAlertProps) => {
  if (isEmailVerified || isLoading) return null;
  return (
    <div className="w-full border-b border-border/70 bg-deepBlue-500/10 px-4 py-1.5">
      <MaxWidthWrapper className="flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <Info size={15} className="text-deepBlue-500 dark:text-deepBlue-400" />
          <p className="text-[13px] font-normal text-deepBlue-500 dark:text-deepBlue-400">
            Please verify your email address
          </p>
        </div>

        <Button
          size="sm"
          className="h-6 rounded-full bg-deepBlue-500 text-xs text-white shadow-none hover:bg-deepBlue-600"
        >
          Verify now
        </Button>
      </MaxWidthWrapper>
    </div>
  );
};
