import { constructMetadata } from "@/utils/construct-metadata";
import prisma from "@/db/prisma";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const link = await prisma.link.findUnique({
    where: { slug: params.slug },
    select: {
      ogTitle: true,
      ogDescription: true,
      destination: true,
      ogImage: true,
      shouldIndex: true,
      shouldProxy: true,
    },
  });

  if (!link || !link.shouldProxy) return notFound();

  return constructMetadata({
    title: link.ogTitle || "",
    description: link.ogDescription || "",
    image: link.ogImage || "",
    icons: `https://www.google.com/s2/favicons?sz=64&domain_url=${link.destination}`,
    noIndex: true,
  });
};

const ProxyPage = async ({ params }: Props) => {
  const link = await prisma.link.findUnique({
    where: { slug: params.slug },
    select: { destination: true, shouldProxy: true },
  });

  // if no link found
  if (!link) return notFound();

  // if link should not be proxied
  // redirect to destination
  if (!link.shouldProxy) redirect(link.destination);

  return <div>Serving metadata to bots...</div>;
};

export default ProxyPage;
