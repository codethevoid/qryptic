import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import type { Post } from "@/types/blogs";
import NextLink from "next/link";
import NextImage from "next/image";
import { format } from "date-fns";

export const MoreFromQryptic = async ({ posts }: { posts: Post[] }) => {
  return (
    <div className="px-4">
      <MaxWidthWrapper className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-center text-3xl font-bold tracking-tight max-md:text-2xl">
            Explore more from{" "}
            <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
              Qryptic
            </span>
          </h2>
          <p className="mx-auto max-w-lg text-center text-muted-foreground max-md:text-sm max-sm:max-w-[340px] max-sm:text-[13px]">
            Explore our latest blog posts for tte latest company news, product updates, educational
            content, and more.
          </p>
        </div>
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
