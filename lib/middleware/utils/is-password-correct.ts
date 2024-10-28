import "server-only";
import { rootDomain, protocol } from "@/utils/qryptic/domains";

const baseURL = `${protocol}${rootDomain}`;

export const isPasswordCorrect = async (password: string, slug: string) => {
  try {
    // This is where we will check if password is correct
    if (!password || !slug) return false;
    const res = await fetch(`${baseURL}/api/links/middleware/${slug}/${password}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.QRYPTIC_API_KEY}`,
      },
    });

    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
};
