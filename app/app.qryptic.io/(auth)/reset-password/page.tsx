import { ResetPasswordForm } from "./form";
import { constructMetadata } from "@/utils/construct-metadata";
import { Suspense } from "react";

export const metadata = constructMetadata({ title: "Qryptic | Reset password" });

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
