import prisma from "@/db/prisma";
import { constructMetadata } from "@/utils/construct-metadata";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const link = await prisma.link.findUnique({
    where: { slug: params.slug },
    select: {
      ogTitle: true,
      ogDescription: true,
      ogImage: true,
      shouldIndex: true,
      domain: { select: { name: true } },
    },
  });

  if (!link) {
    return constructMetadata({
      title: "Qryptic | Link not found",
      description: "The link you are looking for does not exist",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: link.ogTitle || "",
    description: link.ogDescription || "",
    image: link.ogImage || "",
    icons: `https://www.google.com/s2/favicons?sz=64&domain_url=${link.domain.name}`,
    noIndex: !link.shouldIndex,
  });
};

const CloakedPage = async ({ params }: { params: { slug: string } }) => {
  const link = await prisma.link.findUnique({
    where: { slug: params.slug },
    select: { destination: true },
  });

  return <iframe className="h-screen w-screen border-none" src={link?.destination} />;
};

export default CloakedPage;
