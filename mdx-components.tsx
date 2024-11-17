import type { MDXComponents } from "mdx/types";
import NextImage from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: (props: any) => <NextImage {...props} />,
    ...components,
  };
}
