import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { constructMetadata } from "@/utils/construct-metadata";
import { readdirSync } from "fs";
import path from "path";
import NextLink from "next/link";
import NextImage from "next/image";
import { format } from "date-fns";

export const dynamicParams = false;

type Post = {
  category: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
};

export const generateMetadata = ({ params }: { params: { category: string } }) => {
  return constructMetadata({
    title: `Qryptic | ${params.category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")}`,
    description: `The latest ${params.category.replace("-", " ")} blog posts from Qryptic`,
  });
};

export const generateStaticParams = async () => {
  const contentDir = path.join(process.cwd(), "app/main/blog/content");
  const categories = readdirSync(contentDir);
  return categories.map((category) => ({ category }));
};

const getPosts = async (category: string) => {
  const categoryDir = path.join(process.cwd(), "app/main/blog/content", category);
  const files = readdirSync(categoryDir);
  const posts = await Promise.all(
    files.map(async (file) => {
      const { metadata } = await import(`@/app/main/blog/content/${category}/${file}`);
      return { category, slug: file.replace(".mdx", ""), ...metadata };
    }),
  );
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const BlogCategoryPage = async ({ params }: { params: { category: string } }) => {
  const { category } = params;
  const posts: Post[] = await getPosts(category);

  return (
    <div className="h-[calc(100vh-573px)] min-h-fit">
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

export default BlogCategoryPage;
