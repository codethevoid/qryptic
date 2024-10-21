"use client";

import { useLink } from "@/lib/hooks/swr/use-link";

export const EditLinkClient = () => {
  const { data, isLoading, error, mutate } = useLink();

  return <div>{data && JSON.stringify(data)}</div>;
};
