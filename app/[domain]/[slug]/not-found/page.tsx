import { constructMetadata } from "@/utils/construct-metadata";

export const metadata = constructMetadata({
  title: `Qryptic | Link not found`,
  description: "The link you are trying to reach does not exist",
  noIndex: true,
});

const LinkNotFoundPage = () => {
  return <div>Link not found</div>;
};

export default LinkNotFoundPage;
