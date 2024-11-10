import { constructMetadata } from "@/utils/construct-metadata";
import { ForgotPasswordForm } from "./form";

export const metadata = constructMetadata({ title: "Qryptic | Forgot password" });

const ForgotPasswordPage = () => {
  return <ForgotPasswordForm />;
};

export default ForgotPasswordPage;
