export const checkSlug = async (teamSlug: string, slugToCheck: string) => {
  try {
    const res = await fetch(`/api/links/${teamSlug}/slug/check?slugToCheck=${slugToCheck}`);
    if (!res.ok) return { isAvailable: false };
    const data: { isAvailable: boolean } = await res.json();
    return { isAvailable: data.isAvailable };
  } catch (e) {
    console.error(e);
    return { isAvailable: false };
  }
};

export const generateSlug = async (teamSlug: string) => {
  try {
    const res = await fetch(`/api/links/${teamSlug}/slug/generate`);
    if (!res.ok) return { slug: "" };
    const data: { slug: string } = await res.json();
    return { slug: data.slug };
  } catch (e) {
    console.error(e);
    return { slug: "" };
  }
};

export const isSlugUrlSafe = (slug: string) => {
  return /^[a-zA-Z0-9_-]+$/.test(slug);
};
