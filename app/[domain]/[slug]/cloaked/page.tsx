import prisma from "@/db/prisma";

const CloakedPage = async ({ params }: { params: { slug: string } }) => {
  const link = await prisma.link.findUnique({
    where: { slug: params.slug },
    select: { destination: true },
  });

  return <iframe className="h-screen w-screen border-none" src={link?.destination} />;
};

export default CloakedPage;
