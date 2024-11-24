import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { constructMetadata } from "@/utils/construct-metadata";
import { readdirSync } from "fs";
import path from "path";
import NextLink from "next/link";
import NextImage from "next/image";
import { format } from "date-fns";

type Post = {
  category: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
};

export const metadata = constructMetadata({
  title: "Qryptic | Blog",
  description: "The latest news from Qryptic",
});

const getPosts = async () => {
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
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const BlogHomePage = async () => {
  const posts: Post[] = await getPosts();

  return (
    <div className="h-[calc(100vh-586px)] min-h-fit">
      <MaxWidthWrapper>
        <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {posts.map((post) => (
            <NextLink
              href={`/blog/${post.category}/${post.slug}`}
              key={post.slug}
              className="space-y-3 overflow-hidden rounded-xl border bg-background p-4 shadow-md transition-all hover:shadow-lg dark:hover:border-primary"
            >
              <NextImage
                src={post.image}
                alt={post.title}
                width={1200}
                height={630}
                quality={100}
                className="rounded-lg border"
              />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs capitalize text-muted-foreground">
                    {post.category.replace("-", " ")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(post.date), "MMM do, yyyy")}
                  </p>
                </div>
                <p className="line-clamp-2 text-[15px] font-medium max-sm:text-sm">{post.title}</p>
                <p className="line-clamp-2 text-[13px] text-muted-foreground">{post.description}</p>
              </div>
            </NextLink>
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default BlogHomePage;
