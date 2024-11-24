import type { Post } from "@/types/blogs";
import path from "path";
import { readdirSync } from "fs";

export const getPosts = async (take: number = 3): Promise<Post[]> => {
  const contentDir = path.join(process.cwd(), "app/main/blog/content");
  const categories = readdirSync(contentDir);
  const posts = await Promise.all(
    categories.flatMap((category) => {
      const postFiles = readdirSync(path.join(contentDir, category));
      return postFiles.map(async (postFile) => {
        // Make this an async function
        const { metadata } = await import(`@/app/main/blog/content/${category}/${postFile}`);
        return { category, slug: postFile.replace(".mdx", ""), ...metadata };
      });
    }),
  );
  return posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, take);
};
