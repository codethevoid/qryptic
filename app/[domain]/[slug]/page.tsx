// this is where all pages will lead to (short links)
// we need to construct the page based on the link details
// meta title, image, description (open graph)
import { type Metadata } from "next";
import prisma from "@/db/prisma";
import { constructMetadata } from "@/utils/construct-metadata";

type ProxyProps = {
  params: { slug: string };
};

export const generateMetadata = async ({ params }: ProxyProps): Promise<Metadata> => {
  const { slug } = params;
  const link = await prisma.link.findUnique({
    where: { slug },
  });

  if (!link) {
    return constructMetadata({
      title: "Link not found",
      description: "The link you are trying to reach does not exist",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: link.ogTitle || "",
    description: link.ogDescription || "",
    image: link.ogImage || "",
    noIndex: !link.shouldIndex,
  });
};

const ProxyLinkPage = async ({ params }: ProxyProps) => {
  // get link details
  const link = await prisma.link.findUnique({
    where: { slug: params.slug },
  });

  return <div>proxy</div>;
};
