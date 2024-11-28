import type { MDXComponents } from "mdx/types";
import NextLink, { LinkProps } from "next/link";
import { cn } from "@/lib/utils";
import NextImage from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: (props) => <NextLink {...(props as LinkProps)} />,
    ...components,
    pre: (props) => (
      <pre className={cn("max-w-fit rounded-md px-1.5 py-0.5 scrollbar-hide", props.className)}>
        {props.children}
      </pre>
    ),
    Image: (props) => (
      <NextImage {...props} className={cn("rounded-xl border shadow-sm", props.className)} />
    ),
  };
}
