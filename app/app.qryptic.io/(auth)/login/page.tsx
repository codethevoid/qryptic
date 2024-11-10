import { constructMetadata } from "@/utils/construct-metadata";
import { LoginForm } from "./form";

export const metadata = constructMetadata({
  title: "Qryptic | Login to your account",
});

const LoginPage = () => <LoginForm />;

export default LoginPage;
