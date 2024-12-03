import { constructURL } from "@/utils/construct-url";

export const getFinalURL = (url: string, searchParams: string) => {
  if (!searchParams) return constructURL(url);

  const [base, existingParams] = url.split("?");
  if (!existingParams) return constructURL(`${base}${searchParams}`);

  const params = new URLSearchParams(searchParams);
  const paramsInDb = new URLSearchParams(existingParams);
  paramsInDb.forEach((value, key) => {
    params.set(key, value);
  });
  return constructURL(`${base}?${params.toString()}`);
};
