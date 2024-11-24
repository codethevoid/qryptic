import { Metadata } from "next";

type Props = {
  title?: string;
  description?: string;
  image?: string;
  icons?: Metadata["icons"];
  noIndex?: boolean;
};

export const constructMetadata = ({
  title = `Qryptic | Deliver Digital Experiences at Scale`,
  description = `Qryptic | Modernize the way your business delivers impactful marketing campaigns. Easily track, manage, and optimize every campaign, empowering your team to create data-driven strategies and deliver seamless digital experiences at scale.`,
  image = "https://qryptic.s3.us-east-1.amazonaws.com/main/open-graph-light.png",
  icons = [
    {
      rel: "apple-touch-icon",
      sizes: "32x32",
      url: "https://qryptic.s3.us-east-1.amazonaws.com/logos/favicons/apple-touch-icon.png",
    },
    {
      rel: "android-chrome",
      sizes: "192x192",
      url: "https://qryptic.s3.us-east-1.amazonaws.com/logos/favicons/android-chrome-192x192.png",
    },
    {
      rel: "android-chrome",
      sizes: "512x512",
      url: "https://qryptic.s3.us-east-1.amazonaws.com/logos/favicons/android-chrome-512x512.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "https://qryptic.s3.us-east-1.amazonaws.com/logos/favicons/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "https://qryptic.s3.us-east-1.amazonaws.com/logos/favicons/favicon-16x16.png",
    },
  ],
  noIndex = false,
}: Props): Metadata => {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image && { images: image }),
    },
    twitter: {
      title,
      description,
      ...(image && {
        card: "summary_large_image",
        images: [image],
      }),
      creator: "@qryptic_io",
    },
    icons,
    ...(noIndex && {
      robots: {
        follow: false,
        index: false,
      },
    }),
    metadataBase: new URL("https://qryptic.io"),
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
    },
  };
};
