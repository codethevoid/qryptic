import { RegisterForm } from "./form";
import { constructMetadata } from "@/utils/construct-metadata";

export const metadata = constructMetadata({
  title: "Qryptic | Create your account",
});

const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;
