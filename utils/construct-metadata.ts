import { Metadata } from "next";

type Props = {
  title?: string;
  description?: string;
  image?: string;
  icons?: Metadata["icons"];
  noIndex?: boolean;
};

export const constructMetadata = ({
  title = `Qryptic | Your complete link management platform`,
  description = `Qryptic lets you customize and track your links with ease. Build branded links, design unique QR codes, and monitor performance to boost results.`,
  image = "https://cdn.qryptic.io/main/qryptic-open-graph.png",
  icons = [
    {
      rel: "apple-touch-icon",
      sizes: "32x32",
      url: "https://cdn.qryptic.io/logos/favicons/apple-touch-icon.png",
    },
    {
      rel: "android-chrome",
      sizes: "192x192",
      url: "https://cdn.qryptic.io/logos/favicons/android-chrome-192x192.png",
    },
    {
      rel: "android-chrome",
      sizes: "512x512",
      url: "https://cdn.qryptic.io/logos/favicons/android-chrome-512x512.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "https://cdn.qryptic.io/logos/favicons/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "https://cdn.qryptic.io/logos/favicons/favicon-16x16.png",
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
  };
};
