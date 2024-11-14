import prisma from "@/db/prisma";
import { constructMetadata } from "@/utils/construct-metadata";
import { PasswordForm } from "@/app/[domain]/[slug]/password/form";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export const metadata = constructMetadata({
  title: "Password Protected Link",
  description: "This link is password protected. Please enter the password to continue.",
  image: "",
  noIndex: true,
});

const PasswordPage = async ({ params }: Props) => {
  const link = await prisma.link.findUnique({
    where: { slug: params.slug },
    select: { destination: true, passwordHash: true },
  });

  if (!link) return notFound();

  if (!link.passwordHash) redirect(link.destination);

  return <PasswordForm />;
};

export default PasswordPage;
