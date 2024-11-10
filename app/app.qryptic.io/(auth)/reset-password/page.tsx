import { ResetPasswordForm } from "./form";
import { constructMetadata } from "@/utils/construct-metadata";

export const metadata = constructMetadata({ title: "Qryptic | Reset password" });

const ResetPasswordPage = () => {
  return <ResetPasswordForm />;
};

export default ResetPasswordPage;
