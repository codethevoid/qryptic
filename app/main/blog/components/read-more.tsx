import path from "path";
import { readdirSync } from "fs";
import NextImage from "next/image";
import NextLink from "next/link";
import { format } from "date-fns";

type Post = {
  category: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
};

const getPosts = async (category: string, postSlug: string) => {
  const categoryDir = path.join(process.cwd(), "app/main/blog/content", category);
  const files = readdirSync(categoryDir);
  const posts = await Promise.all(
    files.map(async (file) => {
      const { metadata } = await import(`@/app/main/blog/content/${category}/${file}`);
      return { category, slug: file.replace(".mdx", ""), ...metadata };
    }),
  );
  // limit to 3 posts
  return posts
    .filter((post) => post.slug !== postSlug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
};

export const ReadMore = async ({ category, postSlug }: { category: string; postSlug: string }) => {
  const posts: Post[] = await getPosts(category, postSlug);

  if (posts.length === 0) return null;

  return (
    <div className="space-y-4 border-t pt-8">
      <p className="text-lg font-semibold">Continue reading</p>
      <div className="space-y-6">
        {posts.map((post) => (
          <NextLink
            href={`/blog/${post.category}/${post.slug}`}
            key={post.slug}
            className="group flex space-x-6 max-[500px]:block max-[500px]:space-x-0 max-[500px]:space-y-4"
          >
            <NextImage
              src={post.image}
              alt={post.title}
              height={630}
              width={1200}
              quality={100}
              className="w-full max-w-[220px] rounded-lg border shadow-sm max-[500px]:max-w-none"
            />
            <div className="space-y-2 self-center transition-colors max-[500px]:space-y-1.5">
              <p className="text-xs text-muted-foreground decoration-muted-foreground group-hover:underline">
                {format(new Date(post.date), "MMMM do, yyyy")}
              </p>
              <p className="line-clamp-2 text-[15px] font-medium group-hover:underline max-sm:text-sm">
                {post.title}
              </p>
              <p className="line-clamp-2 text-[13px] text-muted-foreground decoration-muted-foreground group-hover:underline">
                {post.description}
              </p>
            </div>
          </NextLink>
        ))}
      </div>
    </div>
  );
};
