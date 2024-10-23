import { constructMetadata } from "@/utils/construct-metadata";
import { appName } from "@/utils/qryptic/domains";

export const metadata = constructMetadata({
  title: `Link not found | ${appName}`,
  description: "The link you are trying to reach does not exist",
  noIndex: true,
});

const LinkNotFoundPage = () => {
  return <div>Link not found</div>;
};

export default LinkNotFoundPage;
