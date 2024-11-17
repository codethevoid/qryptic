import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import path from "path";
import { readdirSync } from "fs";
import { constructMetadata } from "@/utils/construct-metadata";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import NextImage from "next/image";
import { format } from "date-fns";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { readFileSync } from "fs";
import { useMDXComponents } from "@/mdx-components";

export const dynamicParams = false;

const contentDir = path.join(process.cwd(), "app/main/blog/content");

export const generateStaticParams = async () => {
  const categories = readdirSync(contentDir);
  const posts = categories.flatMap((category) => {
    const postFiles = readdirSync(path.join(contentDir, category));
    return postFiles.map((postFile) => {
      return {
        category,
        post: postFile.replace(".mdx", ""),
      };
    });
  });

  return posts;
};

export const generateMetadata = async ({
  params,
}: {
  params: { category: string; post: string };
}) => {
  const { category, post } = params;
  const { metadata } = await import(`@/app/main/blog/content/${category}/${post}.mdx`);
  return constructMetadata({
    title: `${metadata.title} | Qryptic`,
    description: metadata.description,
    image: metadata.image,
  });
};

const BlogPostPage = async ({ params }: { params: { category: string; post: string } }) => {
  const { category, post } = params;
  const { metadata } = await import(`@/app/main/blog/content/${category}/${post}.mdx`);

  const filePath = path.join(process.cwd(), "app/main/blog/content", category, `${post}.mdx`);
  const file = readFileSync(filePath, "utf8");
  const { content } = matter(file);

  const components = useMDXComponents({});

  return (
    <div className="px-4 py-8">
      <MaxWidthWrapper className="max-w-screen-md space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/blog" className="text-[13px]">
                  Blog
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {/* <BreadcrumbItem>
              <BreadcrumbPage className="text-[13px] capitalize">
                {category.replace("-", " ")}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator /> */}
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[13px] capitalize">
                {post.replace("-", " ")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:mb-2 prose-headings:font-bold prose-headings:tracking-tight max-md:prose-h1:text-2xl">
          {/* <Badge className="mb-3 capitalize">{category.replace("-", " ")}</Badge> */}
          {/* <div className="flex items-center gap-2">
            <NextImage
              className="h-6 w-6 rounded-full border"
              src={data.writtenBy.image}
              alt={data.writtenBy.name}
              height={100}
              width={100}
              quality={100}
            />
            <div>
              <p className="text-[13px] text-primary">{data.writtenBy.name}</p>
              <p className="text-xs">{data.writtenBy.title}</p>
            </div>
          </div> */}
          <p className="mb-2 text-[13px]">{format(new Date(metadata.date), "MMMM do, yyyy")}</p>
          <h1>{metadata.title}</h1>
          <p className="mt-2">{metadata.description}</p>
          <NextImage
            src={metadata.image as string}
            alt={metadata.title}
            height={630}
            width={1200}
            quality={100}
            priority
            className="mt-6 w-full rounded-xl border shadow-lg"
          />
        </div>
        <article className="prose prose-sm max-w-none dark:prose-invert prose-headings:mb-2 prose-headings:font-bold prose-headings:tracking-tight">
          {/* <MDXContent.default /> */}
          <MDXRemote source={content} components={components} />
        </article>
      </MaxWidthWrapper>
    </div>
  );
};

export default BlogPostPage;
