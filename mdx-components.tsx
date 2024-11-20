import type { MDXComponents } from "mdx/types";
import NextLink, { LinkProps } from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: (props) => <img {...props} className="rounded-xl border shadow-lg" />,
    a: (props) => <NextLink {...(props as LinkProps)} />,
    ...components,
  };
}
