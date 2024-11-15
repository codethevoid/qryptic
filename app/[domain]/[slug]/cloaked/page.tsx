import prisma from "@/db/prisma";
import { constructMetadata } from "@/utils/construct-metadata";
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
      ogImage: true,
      shouldIndex: true,
      destination: true,
    },
  });

  if (!link) return notFound();

  return constructMetadata({
    title: link.ogTitle || "",
    description: link.ogDescription || "",
    image: link.ogImage || "",
    icons: `https://www.google.com/s2/favicons?sz=64&domain_url=${link.destination}`,
    noIndex: true,
  });
};

const CloakedPage = async ({ params }: Props) => {
  const link = await prisma.link.findUnique({
    where: { slug: params.slug },
    select: { destination: true, shouldCloak: true },
  });

  // if no link found
  if (!link) return notFound();

  // if link should not be cloaked
  if (!link.shouldCloak) redirect(link.destination);

  return (
    <div className="w-full overflow-x-hidden">
      <iframe className="min-h-screen w-full border-none" src={link.destination} />;
    </div>
  );
};

export default CloakedPage;
