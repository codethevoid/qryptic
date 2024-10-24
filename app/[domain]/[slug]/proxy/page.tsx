import { Metadata } from "next";
import { constructMetadata } from "@/utils/construct-metadata";
import prisma from "@/db/prisma";

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
      domain: { select: { name: true } },
    },
  });

  // If the link is not found, return not found metadata
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

const ProxyPage = ({ params }: Props) => {
  return <div>proxy page</div>;
};

export default ProxyPage;
