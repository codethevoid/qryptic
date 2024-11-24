import type { MetadataRoute } from "next";
import { readdirSync } from "fs";
import path from "path";
import { labData } from "@/lib/lab/data";

const generateLabMetadata = () => {
  const labLinks = labData.map((tool) => ({
    url: `https://qryptic.io/lab/${tool.href.split("/")[2]}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  return labLinks;
};

const contentDir = path.join(process.cwd(), "app/main/blog/content");

export const getBlogPosts = async (): Promise<MetadataRoute.Sitemap[0][]> => {
  const categories = readdirSync(contentDir);
  const posts = await Promise.all(
    categories.flatMap((category) => {
      const postFiles = readdirSync(path.join(contentDir, category));
      return postFiles.map(async (postFile) => {
        const { metadata } = await import(`@/app/main/blog/content/${category}/${postFile}`);
        return {
          url: `https://qryptic.io/blog/${category}/${postFile.replace(".mdx", "")}`,
          lastModified: new Date(metadata.updatedAt ? metadata.updatedAt : metadata.date),
          changeFrequency: "monthly" as const,
          priority: metadata.priority ?? 0.6,
        };
      });
    }),
  );

  return posts;
};

const getBlogCategories = async (): Promise<MetadataRoute.Sitemap[0][]> => {
  const categories = readdirSync(contentDir);
  const posts = await getBlogPosts();
  return categories.map((category) => ({
    url: `https://qryptic.io/blog/${category}`,
    lastModified: posts
      .filter((post) => post.url.split("/")[4] === category)
      .sort(
        (a, b) =>
          new Date(b.lastModified as string).getTime() -
          new Date(a.lastModified as string).getTime(),
      )[0]?.lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  // get blog posts
  const posts: MetadataRoute.Sitemap[0][] = await getBlogPosts();
  const categories: MetadataRoute.Sitemap[0][] = await getBlogCategories();
  const labs: MetadataRoute.Sitemap[0][] = generateLabMetadata();

  return [
    {
      url: "https://qryptic.io",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://qryptic.io/pricing",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://qryptic.io/contact",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: "https://qryptic.io/legal/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://qryptic.io/legal/terms",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://qryptic.io/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts,
    ...categories,
    ...labs,
  ];
};

export default sitemap;
