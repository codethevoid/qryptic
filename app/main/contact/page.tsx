import { ContactForm } from "./form";
import { constructMetadata } from "@/utils/construct-metadata";

export const metadata = constructMetadata({
  title: "Qryptic | Contact us",
  description: "Contact us for any questions or feedback",
});

const ContactPage = () => <ContactForm />;

export default ContactPage;
